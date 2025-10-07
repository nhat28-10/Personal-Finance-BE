export interface Transactions {
  transaction_id: number,
  wallet_id: number,
  category_id: number,
  amount: number,
  description: string,
  transaction_date: Date,
  created_at: Date,
  updated_at: Date,
}