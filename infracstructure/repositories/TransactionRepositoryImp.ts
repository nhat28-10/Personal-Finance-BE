import pool from '../db/postgre'
import { Transactions } from '../../domain/entites/Transactions'
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository'

export class TransactionRepositoryImp implements ITransactionRepository {
  async getAllTransactions(wallet_id: number, category_id?: number): Promise<Transactions[]> {
    const query = `SELECT * FROM transactions WHERE wallet_id = $1 AND category_id = $2`
    const result = await pool.query(query, [wallet_id, category_id])
    return result.rows
  }
  async getTransactionById(transaction_id: number, wallet_id: number): Promise<Transactions | null> {
    const query = `SELECT * FROM transaction WHERE wallet_id = $1`
    const result = await pool.query(query, [wallet_id])
    return result.rows[0]
  }
  async createTransaction(
  transaction: Partial<Omit<Transactions, 'transaction_id'>>
): Promise<Transactions> {
  const query = `
    INSERT INTO transactions (wallet_id, category_id, amount, description, transaction_date)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`;
    
  const result = await pool.query(query, [
    transaction.wallet_id,
    transaction.category_id,
    transaction.amount,
    transaction.description,
    transaction.transaction_date
  ]);

  return result.rows[0];
}
  async updateTransaction(
    transaction_id: number,
    wallet_id: number,
    transaction: Partial<Omit<Transactions, 'transaction_id' | 'wallet_id'>>
  ): Promise<Transactions> {
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(transaction)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    fields.push('updated_at = NOW()')
    values.push(transaction_id)
    values.push(wallet_id)
    const query = `
        UPDATE transactions 
        SET ${fields.join(', ')}
        WHERE transacntion_id = $${index} AND wallet_id = $${index + 1}
        RETURNING *
      `
    const result = await pool.query(query, values)
    return result.rows[0]
  }
  async deleteTransaction(transaction_id: number, wallet_id: number): Promise<boolean> {
    const query = `DELETE FROM transactions WHERE transaction_id = $1 AND wallet_id = $2`
    const result = await pool.query(query, [transaction_id, wallet_id])
    return result.rowCount > 0
  }
}
