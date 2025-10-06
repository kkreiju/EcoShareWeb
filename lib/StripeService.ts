import { Alert } from 'react-native';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret: string;
}

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
  paymentMethodId?: string;
}

export class StripeService {
  private static instance: StripeService;
  private apiUrl: string;

  private constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
  }

  public static getInstance(): StripeService {
    if (!StripeService.instance) {
      StripeService.instance = new StripeService();
    }
    return StripeService.instance;
  }

  // Create a payment intent for subscription
  async createPaymentIntent(subscriptionData: SubscriptionData): Promise<PaymentIntentResponse | null> {
    try {
      console.log(subscriptionData)

      const response = await fetch(`${this.apiUrl}/api/stripe/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscriptionData),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data;
        } else {
          throw new Error(data.message || 'Failed to create setup intent');
        }
      } else {
        throw new Error('Network error creating payment intent');
      }
    } catch (error) {
      console.error('Error creating payment intent:', error);
      Alert.alert('Error', 'Failed to create payment. Please try again.');
      return null;
    }
  }

  // Confirm payment and create subscription
  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<boolean> {
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

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'Payment successful! Your subscription is now active.');
          return true;
        } else {
          throw new Error(data.message || 'Payment confirmation failed');
        }
      } else {
        throw new Error('Network error confirming payment');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      Alert.alert('Error', 'Payment confirmation failed. Please try again.');
      return false;
    }
  }

  // Get subscription status
  async getSubscriptionStatus(userId: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/subscription-status?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.success ? data.data : null;
      } else {
        throw new Error('Failed to fetch subscription status');
      }
    } catch (error) {
      console.error('Error fetching subscription status:', error);
      return null;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/stripe/cancel-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          Alert.alert('Success', 'Subscription cancelled successfully.');
          return true;
        } else {
          throw new Error(data.message || 'Failed to cancel subscription');
        }
      } else {
        throw new Error('Network error cancelling subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      Alert.alert('Error', 'Failed to cancel subscription. Please try again.');
      return false;
    }
  }
}
