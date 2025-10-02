import pool from '../db/postgre'

export interface Users {
  user_id: number,
  user_name: string,
  email: string,
  password: string,
  created_at: Date,
  updated_at: Date,
}

export const UserModel = {
  async getAll(): Promise<Users[]> {
    const result = await pool.query('SELECT * FROM users')
    return result.rows
  },
  async getById(user_id: number): Promise<Users | null> {
    const result = await pool.query('SELECT * FROM users where user_id = $1', [user_id])
    return result.rows[0] || null
  },
  async create(user: Omit<Users, "user_id" | "created_at" | "updated_at">): Promise<Users> {
    const result = await pool.query('INSERT INTO users (user_name, email, password) VALUES ($1, $2, $3) RETURNING *', [user.user_name, user.email, user.password])
    return result.rows[0]
  },
  async update(user_id: number, user: Partial<Omit<Users, "user_id" | "created_at">>):Promise<Users> {
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(user)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    // them updated_at
    fields.push(`updated_at = NOW()`)
    const query = `
      UPDATE users
      SET ${fields.join(',')}
      WHERE user_id = $${index}
      RETURNING *`
    values.push(user_id)
    const result = await pool.query(query, values)
    return result.rows[0]
  },
  async delete(user_id: number):Promise<boolean> {
    const result = await pool.query('DELETE FROM users WHERE user_id = $1', [user_id])
    return result.rowCount > 0
  }
}