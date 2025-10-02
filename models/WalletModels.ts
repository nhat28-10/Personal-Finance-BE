import pool from "../db/postgre";

export interface Wallets {
  wallet_id: number,
  user_id: number,
  currency_id: number,
  name: string,
  balance: number,
  created_at: Date,
  updated_at: Date,
}

export const WalletModels = {
  async getAll():Promise<Wallets[]> {
    const result = await pool.query('SELECT * FROM wallets')
    return result.rows
  },
  async getById(wallet_id: number):Promise<Wallets | null> {
    const result = await pool.query('SELECT * FROM wallets WHERE wallet_id = $1', [wallet_id])
    return result.rows[0] || null
  },
  async create(wallet: Omit<Wallets, "wallet_id" | "created_at" | "updated_at">):Promise<Wallets> {
    const result = await pool.query('INSERT INTO wallets (user_id, currency_id, name, balance) VALUES ($1,$2,$3,$4) RETURNING *',[wallet.user_id, wallet.currency_id, wallet.name, wallet.balance])
    return result.rows[0]
  },
  async update(wallet_id:number, wallet: Partial<Omit<Wallets, "wallet_id" | "user_id">>):Promise<Wallets> {
    const fields = []
    const values = []
    let index = 1
    for (const [key,value] of Object.entries(wallet)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    // them updated_at
    fields.push(`updated_at = NOW()`)
    const query = `
      UPDATE wallets 
      SET ${fields.join(', ')}
      WHERE wallet_id = $${index}
      RETURNING *`
    values.push(wallet_id)
    const result = await pool.query(query,values) 
    return result.rows[0]
  },
  async delete(wallet_id: number, user_id: number):Promise<boolean> {
    const result = await pool.query('DELETE FROM wallets WHERE wallet_id = $1 AND user_id = $2',[wallet_id,user_id])
    return result.rowCount > 0
  }
}