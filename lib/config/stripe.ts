/**
 * Stripe configuration
 * Note: Publishable key is safe to expose in client-side code
 * For production, use environment variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
 */
export const STRIPE_PUBLISHABLE_KEY = 
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  'pk_test_51S1gqXHZF7Ow86YbCqb1CWMhq2aPsuYyMpdo3MBwXxdfLy7cpeT6nUCRZUSYGwF189791QGIfcuZYlCHvkWPXAmN00QmhU8ImY';

// Stripe configuration object
export const STRIPE_CONFIG = {
  publishableKey: STRIPE_PUBLISHABLE_KEY,
  merchantIdentifier: 'merchant.com.ecoshare.app', // Optional: for Apple Pay
};

