import pool from "../db/postgre";

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
export const BudgetModels = {
  async getAll():Promise<Budget[]> {
    const result = await pool.query('SELECT * FROM budget')
    return result.rows[0]
  },
  async getById(budget_id:number):Promise<Budget | null>{
    const result = await pool.query('SELECT * FROM budget WHERE budget_id = $1',[budget_id])
    return result.rows[0] || null
  },
  async create(budget:Omit<Budget, "budget_id" | "created_at" | "updated_at">):Promise<Budget> {
    const {user_id, category_id, amount, started_date, end_date} = budget;
    const result = await pool.query(
      'INSERT INTO budget (user_id, category_id, amount, started_date, end_date) VALUES ($1,$2,$3,$4,$5 RETURNING *',
      [user_id, category_id, amount, started_date, end_date] 
    )
    return result.rows[0]
  },
  async update(budget_id:number, budget:Partial<Omit<Budget, "budget_id" | "created_at" | "user_id" | "wallet_id">>):Promise<Budget> {
    const fields = []
    const values = []
    let index = 1
    for (const [key,value] of Object.entries(budget)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    fields.push(`updated_at = NOW()`)
    const query = `
      UPDATE budget
      SET ${fields.join(', ')}
      WHERE budget_id = $${index}
      RETURNING *`
      values.push(budget_id)
      const result = await pool.query(query,values)
      return result.rows[0]
  },
  async delete(budget_id:number, wallet_id: number) {
    const result = await pool.query
    ('DELETE FROM budget WHERE budget_id = $1 AND wallet_id = $2',[budget_id, wallet_id])
    return result.rowCount > 0
  }
}