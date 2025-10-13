import pool from '../db/postgre'
import { Currencies } from '../../domain/entites/Currencies'
import { ICurrencyRepository } from '../../domain/repositories/ICurrencyRepository'

export class CurrencyRepositoryImp implements ICurrencyRepository {
  async getAllCurrencies(): Promise<Currencies[]> {
    const query = `SELECT * FROM currencies`
    const result = await pool.query(query)
    return result.rows
  }
  async findCurrencyId(currency_id: number): Promise<Currencies | null> {
    const query = `SELECT * FROM currencies WHERE currency_id = $1`
    const result = await pool.query(query, [currency_id])
    return result.rows[0] || null
  }
  async createCurrency(currency: Partial<Omit<Currencies, 'currency_id'>>): Promise<Currencies> {
    const query = `INSERT INTO currencies (name, code, symbol) VALUES ($1,$2,$3) RETURNING*`
    const result = await pool.query(query, [currency.name, currency.code, currency.symbol])
    return result.rows[0]
  }
  async updateCurrency(currency_id: number, currency: Partial<Omit<Currencies, 'currency_id'>>): Promise<Currencies> {
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(currency)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    values.push(currency_id)
    const query = `
        UPDATE currencies SET ${fields.join(', ')} WHERE currency_id = $${index}
        RETURNING *
      `
    const result = await pool.query(query, values)
    return result.rows[0]
  }
  async deleteCurrency(currency_id: number): Promise<boolean> {
    const query = `DELETE FROM currencies WHERE currency_id = $1`
    const result = await pool.query(query, [currency_id])
    return result.rowCount > 0
  }
}
