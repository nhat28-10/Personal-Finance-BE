import pool from "../db/postgre";

export interface Currencies {
  currency_id: number,
  name: string,
  code: string,
  symbol: string,

}
export const CurrencyModel = {
  async getAll():Promise<Currencies[]> {
    const result = await pool.query('SELECT * FROM currencies')
    return result.rows
  },
  async getById(currency_id: number):Promise<Currencies | null> {
    const result = await pool.query('SELECT * FROM currencies WHERE currency_id = $1',[currency_id])
    return result.rows[0] || null
  },
  async create(currency: Omit<Currencies, "currency_id">):Promise<Currencies> {
    const result = await pool.query('INSERT INTO currencies (name, code, symbol) VALUES ($1, $2, $3) RETURNING *',[currency.name, currency.code, currency.symbol])
    return result.rows[0]
  },
  async update(currency_id: number, currency: Partial<Omit<Currencies, "currency_id">>):Promise<Currencies>{
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(currency)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    const query = `
      UPDATE currencies
      SET ${fields.join(',')}
      WHERE currency_id = $${index}
      RETURNING *`
    values.push(currency_id)
    const result = await pool.query(query, values)
    return result.rows[0]
  },
  async delete(currency_id: number):Promise<boolean> {
    const result = await pool.query('DELETE FROM currencies WHERE currency_id = $1',[currency_id])
    return result.rowCount > 0
  }
}