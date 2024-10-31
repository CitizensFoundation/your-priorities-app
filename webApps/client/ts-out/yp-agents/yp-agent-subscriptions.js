var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { YpBaseElement } from "../common/yp-base-element.js";
import "@material/web/radio/radio.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/button/filled-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/progress/circular-progress.js";
let YpSubscriptions = class YpSubscriptions extends YpBaseElement {
    static get styles() {
        return [
            super.styles,
            css `
        :host {
          display: block;
          padding: 32px;
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 48px;
          text-align: center;
        }

        .main-title {
          font-size: 48px;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--md-sys-color-on-surface);
          line-height: 1.2;
        }

        .main-title .highlight {
          color: #2ecc71;
        }

        .subtitle {
          font-size: 20px;
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
        }

        .agents-container {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .agent-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 24px;
          border-radius: 16px;
          background: var(--md-sys-color-surface-container);
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .agent-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }

        .agent-card:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #2ecc71, #3498db);
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }

        .agent-card:hover:before {
          opacity: 1;
        }

        .agent-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f1c40f;
          color: black;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 20px;
          flex-shrink: 0;
          transition: transform 0.3s ease-in-out;
        }

        .agent-card:hover .agent-number {
          transform: rotate(360deg);
        }

        .agent-image {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 3px solid var(--md-sys-color-outline);
          transition: border-color 0.2s ease-in-out;
        }

        .agent-card:hover .agent-image {
          border-color: #2ecc71;
        }

        .agent-content {
          flex-grow: 1;
        }

        .agent-title {
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 8px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .agent-type {
          color: var(--md-sys-color-outline);
          font-weight: normal;
          font-size: 0.8em;
          padding: 2px 8px;
          background: var(--md-sys-color-surface-variant);
          border-radius: 12px;
        }

        .agent-description {
          color: var(--md-sys-color-on-surface-variant);
          margin: 0;
          font-size: 16px;
          line-height: 1.5;
        }

        .selection-control {
          display: flex;
          flex-direction: column;
          gap: 8px;
          align-items: flex-end;
        }

        .pricing-tag {
          background: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .free-tag {
          background: #2ecc71;
          color: white;
        }

        .payment-section {
          margin-top: 32px;
          padding: 24px;
          border-radius: 16px;
          background: var(--md-sys-color-surface-container-high);
        }

        .action-button {
          width: 100%;
          max-width: 320px;
          margin: 32px auto 0;
          display: block;
        }

        @media (max-width: 768px) {
          .agent-card {
            flex-direction: column;
            text-align: center;
            padding: 16px;
          }

          .selection-control {
            align-items: center;
            margin-top: 16px;
          }

          .agent-content {
            text-align: center;
          }

          .agent-title {
            justify-content: center;
            flex-wrap: wrap;
          }
        }
      `
        ];
    }
    renderHeader() {
        return html `
      <div class="header">
        <h1 class="main-title">
          AI agents that make the
          <span class="highlight">impossible</span>
          possible
        </h1>
        <p class="subtitle">You pick the Agents you need and run them on your schedule</p>
      </div>
    `;
    }
    processPlanData(plans) {
        const bundleMap = new Map();
        plans.forEach(plan => {
            const product = plan.AgentProduct;
            if (!product)
                return;
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
                const bundleGroup = bundleMap.get(bundle.id);
                const existingProduct = bundleGroup.products.find(p => p.id === product.id);
                if (existingProduct) {
                    existingProduct.plans.push(plan);
                }
                else {
                    bundleGroup.products.push({
                        id: product.id,
                        user_id: product.user_id,
                        group_id: product.group_id,
                        domain_id: product.domain_id,
                        name: product.name,
                        description: product.description,
                        configuration: product.configuration,
                        status: product.status,
                        plans: [plan]
                    });
                }
            });
        });
        this.bundleGroups = Array.from(bundleMap.values());
    }
    handleProductSelect(productId, isFree) {
        if (isFree) {
            this.handleFreeProductSelect(productId);
        }
        else {
            this.handlePaidProductSelect(productId);
        }
    }
    renderAgent(product, index) {
        const freePlan = product.plans.find(plan => plan.configuration.type === 'free');
        const paidPlans = product.plans.filter(plan => plan.configuration.type === 'paid');
        return html `
      <div class="agent-card" @click=${() => this.handleProductSelect(product.id, freePlan !== undefined)}>
        <div class="agent-number">${index + 1}</div>
        <img
          class="agent-image"
          src="${product.configuration?.imageUrl}"
          alt="${product.name || ''}"
        >
        <div class="agent-content">
          <h3 class="agent-title">
            ${product.name}
            <span class="agent-type">Agent</span>
          </h3>
          <p class="agent-description">${product.description}</p>
        </div>
        <div class="selection-control">
          ${freePlan
            ? html `
                <md-checkbox
                  ?checked=${this.selectedFreeProductId === product.id}
                  @change=${() => this.handleFreeProductSelect(product.id)}
                ></md-checkbox>
                <div class="pricing-tag free-tag">Free Trial</div>
              `
            : html `
                <md-radio
                  ?checked=${this.selectedPaidProductIds.has(product.id)}
                  @change=${() => this.handlePaidProductSelect(product.id)}
                ></md-radio>
                ${paidPlans.map(plan => html `
                  <div class="pricing-tag">
                    ${plan.configuration.amount} ${plan.configuration.currency}/${plan.configuration.billing_cycle}
                  </div>
                `)}
              `}
        </div>
      </div>
    `;
    }
    render() {
        if (this.loading) {
            return html `
        <div class="loading-container">
          <md-circular-progress indeterminate></md-circular-progress>
        </div>
      `;
        }
        if (this.error) {
            return html `
        <div class="error-message">
          ${this.error}
        </div>
      `;
        }
        const allProducts = this.bundleGroups.flatMap(group => group.products);
        return html `
      ${this.renderHeader()}
      <div class="agents-container">
        ${allProducts.map((product, index) => this.renderAgent(product, index))}
      </div>

      ${this.selectedPaidProductIds.size > 0 ? html `
        <div class="payment-section">
          <div id="payment-element"></div>
        </div>
      ` : nothing}

      <md-filled-button
        class="action-button"
        ?disabled=${this.processingPayment ||
            (!this.selectedFreeProductId && this.selectedPaidProductIds.size === 0)}
        @click=${this.handleSubscribe}
      >
        ${this.processingPayment
            ? html `<md-circular-progress indeterminate></md-circular-progress>`
            : 'Get Started'}
      </md-filled-button>
    `;
    }
    constructor() {
        super();
        this.loading = true;
        this.error = null;
        this.bundleGroups = [];
        this.selectedFreeProductId = null;
        this.selectedPaidProductIds = new Set();
        this.processingPayment = false;
        this.initializeStripe();
    }
    async initializeStripe() {
        /*const stripeKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
        if (!stripeKey) {
          console.error('Stripe public key not found');
          return;
        }
    
        this.stripe = await loadStripe(stripeKey);*/
    }
    async firstUpdated() {
        try {
            await this.loadSubscriptionPlans();
        }
        catch (error) {
            console.error('Error loading subscription plans:', error);
            this.error = 'Failed to load subscription plans';
        }
        finally {
            this.loading = false;
        }
    }
    async loadSubscriptionPlans() {
        const response = await fetch('/api/subscriptions/plans');
        if (!response.ok)
            throw new Error('Failed to fetch subscription plans');
        const plans = await response.json();
        this.processPlanData(plans);
    }
    handleFreeProductSelect(productId) {
        this.selectedFreeProductId = this.selectedFreeProductId === productId ? null : productId;
    }
    handlePaidProductSelect(productId) {
        if (this.selectedPaidProductIds.has(productId)) {
            this.selectedPaidProductIds.delete(productId);
        }
        else {
            this.selectedPaidProductIds.add(productId);
        }
        this.selectedPaidProductIds = new Set(this.selectedPaidProductIds);
    }
    async handleSubscribe() {
        if (!this.selectedFreeProductId && this.selectedPaidProductIds.size === 0) {
            this.error = 'Please select at least one product';
            return;
        }
        if (this.selectedFreeProductId) {
            await this.handleFreeSubscription();
        }
        else {
            await this.handlePaidSubscription();
        }
    }
    async handleFreeSubscription() {
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
            if (!response.ok)
                throw new Error('Failed to create subscription');
            window.location.href = `/domain/${this.domainId}/assistant`;
        }
        catch (error) {
            console.error('Error creating free subscription:', error);
            this.error = 'Failed to create subscription';
        }
    }
    async handlePaidSubscription() {
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
            if (!response.ok)
                throw new Error('Failed to create payment intent');
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
        }
        catch (error) {
            console.error('Payment error:', error);
            this.error = error.message || 'Payment failed';
        }
        finally {
            this.processingPayment = false;
        }
    }
};
__decorate([
    property({ type: Number })
], YpSubscriptions.prototype, "domainId", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "loading", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "error", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "bundleGroups", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "selectedFreeProductId", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "selectedPaidProductIds", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "processingPayment", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "stripe", void 0);
__decorate([
    state()
], YpSubscriptions.prototype, "elements", void 0);
YpSubscriptions = __decorate([
    customElement("yp-subscriptions")
], YpSubscriptions);
export { YpSubscriptions };
//# sourceMappingURL=yp-agent-subscriptions.js.map