/**
 * StripeService - Frontend service to interact with Stripe backend APIs
 * Handles payment intents, subscriptions, and payment confirmations
 */

export interface PaymentIntentResponse {
  success: boolean;
  client_secret: string;
  payment_intent_id: string;
  customer_id: string;
  price_id: string;
}

export interface SubscriptionData {
  userId: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  billing_information_firstName: string;
  billing_information_lastName: string;
  billing_information_address: string;
}

export interface SubscriptionHistoryItem {
  user_id: string;
  sub_amountDue: number;
  sub_status: string;
  sub_details: string | object;
  created_at?: string;
  sub_dateTime?: string; // Fallback field name from database
}

export interface StripeNextAction {
  type: string;
  [key: string]: unknown; // Stripe next_action can have various properties
}

export interface SubscriptionStatusResponse {
  success: boolean;
  subscription?: {
    id: string;
    status: string;
    current_period_end?: number;
    cancel_at_period_end?: boolean;
    [key: string]: unknown;
  };
  customer?: {
    id: string;
    email?: string;
    [key: string]: unknown;
  };
  message?: string;
}

export interface ConfirmPaymentResponse {
  success: boolean;
  paymentIntent?: {
    id: string;
    status: string;
    client_secret: string;
    amount: number;
    currency: string;
    next_action?: StripeNextAction;
  };
  setupIntent?: {
    id: string;
    status: string;
    payment_method: string;
    next_action?: StripeNextAction;
  };
  message?: string;
}


export class StripeService {
  private static instance: StripeService;
  private apiUrl: string;

  private constructor() {
    // Use relative URLs for Next.js API routes
    this.apiUrl = '';
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  /**
   * Create a payment intent for subscription
   * @param subscriptionData - Subscription details including user info and billing details
   * @returns PaymentIntentResponse or null on error
   */
  async createPaymentIntent(subscriptionData: SubscriptionData): Promise<PaymentIntentResponse | null> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        throw new Error(data.message || data.error || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment with Stripe
   * @param paymentIntentId - Payment intent ID to confirm
   * @param paymentMethodId - Payment method ID from Stripe
   * @returns ConfirmPaymentResponse
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethodId: string
  ): Promise<ConfirmPaymentResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          paymentMethodId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        throw new Error(data.message || data.error || 'Payment confirmation failed');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  /**
   * Get subscription history for a user
   * @param userId - User ID to fetch subscription history for
   * @returns Array of subscription history items
   */
  async getSubscriptionHistory(userId: string): Promise<SubscriptionHistoryItem[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/api/user/subscription-history?user_id=${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        return data.data || [];
      } else {
        throw new Error(data.message || data.error || 'Failed to fetch subscription history');
      }
    } catch (error) {
      console.error('Error fetching subscription history:', error);
      throw error;
    }
  }

  /**
   * Get subscription status from Stripe
   * @param subscriptionId - Stripe subscription ID (optional)
   * @param customerId - Stripe customer ID (optional)
   * @returns Subscription status data
   */
  async getSubscriptionStatus(
    subscriptionId?: string,
    customerId?: string
  ): Promise<SubscriptionStatusResponse> {
    try {
      let url = `${this.apiUrl}/api/stripe/subscription-status?`;
      
      if (subscriptionId) {
        url += `subscription_id=${subscriptionId}`;
      } else if (customerId) {
        url += `customer_id=${customerId}`;
      } else {
        throw new Error('Either subscription_id or customer_id is required');
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data: SubscriptionStatusResponse = await response.json();

      if (response.ok && data.success) {
        return data;
      } else {
        throw new Error(data.message || 'Failed to fetch subscription status');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      throw error;
    }
  }

}

// Export singleton instance
export const stripeService = StripeService.getInstance();

