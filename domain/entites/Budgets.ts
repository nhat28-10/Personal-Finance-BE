export interface Budget {
  budget_id: number,
  user_id: number,
  category_id: number,
  amount: number,
  started_date: Date,
  end_date: Date,
  created_at: Date,
  updated_at: Date,
}