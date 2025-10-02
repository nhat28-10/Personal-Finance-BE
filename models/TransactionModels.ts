import pool from "../db/postgre";

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

export const TransactionModels = {
  async getAll():Promise<Transactions[]> {
    const result = await pool.query('SELECT * FROM transactions')
    return result.rows
  },
  async getById(transaction_id: number):Promise<Transactions | null> {
    const result = await pool.query('SELECT * FROM transactions WHERE transaction_id = $1',[transaction_id])
    return result.rows[0] || null
  },
  async create(transaction: Omit<Transactions, "transaction_id" | "created_at" | "updated_at">):Promise<Transactions> {
    const {wallet_id, category_id, amount, description, transaction_date} = transaction;
    const result = await pool.query
    ('INSERT INTO transactions (wallet_id, category_id, amount, description, transaction_date) VALUES ($1,$2,$3,$4,$5) RETURNING *',[wallet_id, category_id, amount, description, transaction_date])
    return result.rows[0]
  },
  async update(transaction_id:number, transaction:Partial<Omit<Transactions, "transaction_id" | "created_at" | "wallet_id">>):Promise<Transactions>{
    const fields = []
    const values = []
    let index = 1
    for (const [key,value] of Object.entries(transaction)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    fields.push(`updated_at = NOW()`)
    const query = `
      UPDATE transactions
      SET ${fields.join(', ')}
      WHERE transaction_id = $${index}
      RETURNING *`
      values.push(transaction_id)
      const result = await pool.query(query,values)
      return result.rows[0]
  },
  async delete(transaction_id: number, wallet_id: number):Promise<boolean>{
    const result = await pool.query
    ('DELETE FROM transactions WHERE transaction_id = $1 AND wallet_id = $2',[transaction_id, wallet_id])
    return result.rowCount > 0
  }
 }