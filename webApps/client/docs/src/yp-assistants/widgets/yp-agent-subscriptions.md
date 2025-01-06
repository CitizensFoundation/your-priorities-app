# YpSubscriptions

The `YpSubscriptions` class is a web component that allows users to select and subscribe to various AI agent products. It provides a user interface for selecting free or paid subscription plans and handles the subscription process, including payment processing.

## Properties

| Name      | Type   | Description                                      |
|-----------|--------|--------------------------------------------------|
| domainId  | number | The domain ID associated with the subscription.  |

## Methods

| Name                   | Parameters | Return Type | Description                                                                 |
|------------------------|------------|-------------|-----------------------------------------------------------------------------|
| renderHeader           | None       | TemplateResult | Renders the header section of the component.                                |
| processPlanData        | plans: YpSubscriptionPlanWithRelations[] | void | Processes subscription plan data and organizes it into bundle groups.       |
| handleProductSelect    | productId: number, isFree: boolean | void | Handles the selection of a product, distinguishing between free and paid.   |
| renderAgent            | product: AgentProductWithPlan, index: number | TemplateResult | Renders an individual agent product card.                                   |
| render                 | None       | TemplateResult | Renders the entire component, including loading and error states.           |
| initializeStripe       | None       | Promise<void> | Initializes the Stripe payment system.                                      |
| firstUpdated           | None       | Promise<void> | Lifecycle method called after the component's first render.                 |
| loadSubscriptionPlans  | None       | Promise<void> | Loads subscription plans from the API.                                      |
| handleFreeProductSelect| productId: number | void | Toggles the selection of a free product.                                    |
| handlePaidProductSelect| productId: number | void | Toggles the selection of a paid product.                                    |
| handleSubscribe        | None       | Promise<void> | Handles the subscription process for selected products.                     |
| handleFreeSubscription | None       | Promise<void> | Handles the subscription process for a free product.                        |
| handlePaidSubscription | None       | Promise<void> | Handles the subscription process for paid products, including payment.      |

## Examples

```typescript
// Example usage of the YpSubscriptions web component
import './path/to/yp-subscriptions.js';

const subscriptionElement = document.createElement('yp-subscriptions');
subscriptionElement.domainId = 123;
document.body.appendChild(subscriptionElement);
```

This component is designed to be used in a web application where users can select AI agent products and manage their subscriptions. It integrates with a backend API to fetch subscription plans and uses Stripe for payment processing.