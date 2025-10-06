export interface UserProfile {
  user_id: string;
  user_firstName: string;
  user_middleName?: string;
  user_lastName: string;
  user_bio?: string;
  user_phoneNumber?: string;
  user_profileURL?: string;
  user_ratings?: number;
  user_transactionCount?: number;
}
