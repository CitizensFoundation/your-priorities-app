import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";

import "@material/web/radio/radio.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";

interface BundleGroup {
  bundleId: number;
  name: string;
  description: string;
  imageUrl?: string;
  products: AgentProductWithPlan[];
}

interface AgentProductWithPlan {
  id: number;
  name: string;
  description?: string;
  plans: YpSubscriptionPlanAttributes[];
}

@customElement("yp-subscriptions")
export class YpSubscriptions extends YpBaseElement {
  @property({ type: Number })
  domainId!: number;

  @state()
  private loading = true;

  @state()
  private error: string | null = null;

  @state()
  private bundleGroups: BundleGroup[] = [];

  @state()
  private selectedFreeProductId: number | null = null;

  @state()
  private selectedPaidProductIds: Set<number> = new Set();

  @state()
  private processingPayment = false;

  @state()
  private stripe: any;

  @state()
  private elements: any;

  static override get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          padding: 24px;
        }

        .bundle-group {
          margin-bottom: 32px;
          padding: 24px;
          border-radius: 8px;
          border: 1px solid var(--md-sys-color-outline);
        }

        .bundle-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .bundle-image {
          width: 64px;
          height: 64px;
          border-radius: 8px;
          object-fit: cover;
        }

        .bundle-title {
          margin: 0;
          color: var(--md-sys-color-on-surface);
        }

        .bundle-description {
          margin: 0;
          color: var(--md-sys-color-on-surface-variant);
        }

        .product-list {
          display: grid;
          gap: 16px;
          margin-top: 16px;
        }

        .product-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--md-sys-color-outline-variant);
        }

        .product-details {
          flex-grow: 1;
        }

        .product-name {
          margin: 0;
          font-weight: 500;
        }

        .product-description {
          margin: 4px 0 0;
          color: var(--md-sys-color-on-surface-variant);
        }

        .price {
          font-weight: 500;
          color: var(--md-sys-color-primary);
        }

        .payment-section {
          margin-top: 24px;
          padding-top: 24px;
          border-top: 1px solid var(--md-sys-color-outline-variant);
        }

        #payment-element {
          margin-top: 16px;
          margin-bottom: 24px;
        }

        .error-message {
          color: var(--md-sys-color-error);
          margin: 8px 0;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }
      `
    ];
  }

  constructor() {
    super();
    this.initializeStripe();
  }

  async initializeStripe() {
    const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    if (!stripeKey) {
      console.error('Stripe public key not found');
      return;
    }

    this.stripe = await loadStripe(stripeKey);
  }

  override async firstUpdated() {
    try {
      await this.loadSubscriptionPlans();
    } catch (error) {
      console.error('Error loading subscription plans:', error);
      this.error = 'Failed to load subscription plans';
    } finally {
      this.loading = false;
    }
  }

  private async loadSubscriptionPlans() {
    const response = await fetch('/api/subscriptions/plans');
    if (!response.ok) throw new Error('Failed to fetch subscription plans');

    const plans = await response.json();
    this.processPlanData(plans);
  }

  private processPlanData(plans: YpSubscriptionPlanAttributes[]) {
    const bundleMap = new Map<number, BundleGroup>();

    plans.forEach(plan => {
      const product = plan.AgentProduct;
      if (!product) return;

      product.Bundles?.forEach(bundle => {
        if (!bundleMap.has(bundle.id)) {
          bundleMap.set(bundle.id, {
            bundleId: bundle.id,
            name: bundle.name,
            description: bundle.description || '',
            imageUrl: bundle.configuration?.imageUrl,
            products: []
          });
        }

        const bundleGroup = bundleMap.get(bundle.id)!;
        const existingProduct = bundleGroup.products.find(p => p.id === product.id);

        if (existingProduct) {
          existingProduct.plans.push(plan);
        } else {
          bundleGroup.products.push({
            id: product.id,
            name: product.name || '',
            description: product.description,
            plans: [plan]
          });
        }
      });
    });

    this.bundleGroups = Array.from(bundleMap.values());
  }

  private handleFreeProductSelect(productId: number) {
    this.selectedFreeProductId = this.selectedFreeProductId === productId ? null : productId;
  }

  private handlePaidProductSelect(productId: number) {
    if (this.selectedPaidProductIds.has(productId)) {
      this.selectedPaidProductIds.delete(productId);
    } else {
      this.selectedPaidProductIds.add(productId);
    }
    this.selectedPaidProductIds = new Set(this.selectedPaidProductIds);
  }

  private async handleSubscribe() {
    if (!this.selectedFreeProductId && this.selectedPaidProductIds.size === 0) {
      this.error = 'Please select at least one product';
      return;
    }

    if (this.selectedFreeProductId) {
      await this.handleFreeSubscription();
    } else {
      await this.handlePaidSubscription();
    }
  }

  private async handleFreeSubscription() {
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: this.selectedFreeProductId,
          type: 'free'
        })
      });

      if (!response.ok) throw new Error('Failed to create subscription');

      window.location.href = `/domain/${this.domainId}/assistant`;
    } catch (error) {
      console.error('Error creating free subscription:', error);
      this.error = 'Failed to create subscription';
    }
  }

  private async handlePaidSubscription() {
    if (!this.stripe) {
      this.error = 'Payment system not initialized';
      return;
    }

    try {
      this.processingPayment = true;

      // Create payment intent
      const response = await fetch('/api/subscriptions/payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productIds: Array.from(this.selectedPaidProductIds)
        })
      });

      if (!response.ok) throw new Error('Failed to create payment intent');

      const { clientSecret } = await response.json();

      // Confirm payment
      const { error } = await this.stripe.confirmPayment({
        elements: this.elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/domain/${this.domainId}/assistant`,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      this.error = error.message || 'Payment failed';
    } finally {
      this.processingPayment = false;
    }
  }

  private renderBundleGroup(group: BundleGroup) {
    return html`
      <div class="bundle-group">
        <div class="bundle-header">
          ${group.imageUrl
            ? html`<img src="${group.imageUrl}" alt="${group.name}" class="bundle-image">`
            : nothing}
          <div>
            <h2 class="bundle-title">${group.name}</h2>
            <p class="bundle-description">${group.description}</p>
          </div>
        </div>

        <div class="product-list">
          ${group.products.map(product => this.renderProduct(product, group))}
        </div>
      </div>
    `;
  }

  private renderProduct(product: AgentProductWithPlan, group: BundleGroup) {
    const freePlan = product.plans.find(plan => plan.type === 'free');
    const paidPlans = product.plans.filter(plan => plan.type === 'paid');

    return html`
      <div class="product-item">
        ${freePlan
          ? html`
            <md-checkbox
              ?checked=${this.selectedFreeProductId === product.id}
              @change=${() => this.handleFreeProductSelect(product.id)}
            ></md-checkbox>`
          : html`
            <md-radio
              ?checked=${this.selectedPaidProductIds.has(product.id)}
              @change=${() => this.handlePaidProductSelect(product.id)}
            ></md-radio>`
        }

        <div class="product-details">
          <h3 class="product-name">${product.name}</h3>
          ${product.description
            ? html`<p class="product-description">${product.description}</p>`
            : nothing}
        </div>

        <div class="price">
          ${freePlan
            ? 'Free Trial'
            : paidPlans.map(plan => html`${plan.amount} ${plan.currency}/
              ${plan.billing_cycle}`)}
        </div>
      </div>
    `;
  }

  override render() {
    if (this.loading) {
      return html`
        <div class="loading-container">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
      `;
    }

    if (this.error) {
      return html`
        <div class="error-message">
          ${this.error}
        </div>
      `;
    }

    return html`
      <div>
        ${this.bundleGroups.map(group => this.renderBundleGroup(group))}

        ${this.selectedPaidProductIds.size > 0 ? html`
          <div class="payment-section">
            <div id="payment-element"></div>
          </div>
        ` : nothing}

        <md-filled-button
          ?disabled=${this.processingPayment ||
            (!this.selectedFreeProductId && this.selectedPaidProductIds.size === 0)}
          @click=${this.handleSubscribe}
        >
          ${this.processingPayment
            ? html`<md-circular-progress indeterminate></md-circular-progress>`
            : 'Subscribe'}
        </md-filled-button>
      </div>
    `;
  }
}