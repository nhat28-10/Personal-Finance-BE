import pool from "../db/postgre"
import { Users } from "../../domain/entites/Users"
import { IUserRepository } from "../../domain/repositories/IUserRepository"

export class UserRepositoryImp implements IUserRepository {
  async getAll(): Promise<Users[]> {
      const result =  await pool.query("SELECT * FROM users")
      return result.rows
  }
  async getById(user_id: number): Promise<Users | null> {
      const result = await pool.query("SELECT * FROM users WHERE user_id = $1",[user_id])
      return result.rows[0] || null
  }
  async create(user: Omit<Users, "user_id" | "created_at" | "updated_at">): Promise<Users> {
      const result = await pool.query(
        "INSERT INTO users (user_name, email, password) VALES ($1,$2,$3) RETURNING *",
      [user.user_name , user.email, user.password]
      )
      return result.rows[0]
  }
  async update(user_id: number, user: Partial<Omit<Users, "user_id" | "created_at">>): Promise<Users> {
      const fields = []
      const values = []
      let index = 1
      for (const [key,value] of Object.entries(user)) {
        fields.push(`${key} == $${index}`)
        values.push(value)
        index++
      }
      fields.push("updated_at = NOW()")
      values.push(user_id)
      const query = `UPDATE users SET ${fields.join(", ")} WHERE user_id = $${index} RETURNING *`
      const result = await pool.query(query,values)
      return result.rows[0]
  }
  async delete(user_id: number): Promise<boolean> {
      const result = await pool.query("DELETE FROM users WHERE user_id = $1", [user_id])
      return result.rowCount > 0
  }
}
