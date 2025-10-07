import pool from "../db/postgre"
import { Categories } from "../../domain/entites/Categories"
import { ICategoryRepository } from "../../domain/repositories/ICategoryRepository"

export class CategoryRepositoryImp implements ICategoryRepository {
  async getAllCategory(): Promise<Categories[]> {
      const result = await pool.query("SELECT * FROM categories")
      return result.rows
  }
  async getCategoryById(category_id: number): Promise<Categories | null> {
      const result = await pool.query("SELECT * FROM categories WHERE category_id = $1 ",[category_id])
      return result.rows[0] || null
  }
  async createCategory(category: Omit<Categories, "category_id">): Promise<Categories> {
      const result = await pool.query(`INSERT INTO categories (name, type, description, image) 
        VALUES ($1,$2,$3,$4) RETURNING *`,[category.name, category.type, category.description, category.image])
      return result.rows[0]
  }
  async updateCategory(category_id: number, category: Partial<Omit<Categories, "category_id">>): Promise<Categories> {
      const fields = []
      const values = []
      let index  = 1
      for (const [key, value] of Object.entries(category)) {
        fields.push(`${key} = $${index}`)
        values.push(value)
        index++
      }
      values.push(category_id)
      const query = `
        UPDATE categories 
        SET ${fields.join(", ")}
        WHERE category_id = $${index}
        RETURNING *
      `
      const result = await pool.query(query, values)
      return result.rows[0]
  }
  async deleteCategory(category_id: number): Promise<boolean> {
      const result = await pool.query(`DELETE FROM categories WHERE category_id = $1`,[category_id])
      return result.rowCount > 0
  }
}