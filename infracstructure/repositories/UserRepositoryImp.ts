import pool from '../db/postgre'
import { Users } from '../../domain/entites/Users'
import { IUserRepository } from '../../domain/repositories/IUserRepository'

export class UserRepositoryImp implements IUserRepository {
  async getAllUsers(): Promise<Users[]> {
    const query = `SELECT * FROM users`
    const result = await pool.query(query)
    return result.rows
  }
  async getUserById(user_id: number): Promise<Users | null> {
    const query = `SELECT * FROM users WHERE user_id = $1`
    const result = await pool.query(query, [user_id])
    return result.rows[0] || null
  }
  async createUser(user: Omit<Users, 'user_id' | 'created_at' | 'updated_at'>): Promise<Users> {
    const query = `INSERT INTO users (user_name, email, password) VALUES ($1,$2,$3) RETURNING *`
    const result = await pool.query(query, [user.user_name, user.email, user.password])
    return result.rows[0]
  }
  async updateUser(user_id: number, user: Partial<Omit<Users, 'user_id' | 'created_at'>>): Promise<Users> {
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(user)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    fields.push('updated_at = NOW()')
    values.push(user_id)
    const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = $${index} RETURNING *`
    const result = await pool.query(query, values)
    return result.rows[0]
  }
  async deleteUser(user_id: number): Promise<boolean> {
    const query = `DELETE FROM users WHERE user_id = $1`
    const result = await pool.query(query, [user_id])
    return result.rowCount > 0
  }
  async getUserByEmail(email: string): Promise<Users | null> {
      const query = `SELECT * FROM users WHERE email = $1`
      const result = await pool.query(query, [email])
      return result.rows[0] || null
  }
}
