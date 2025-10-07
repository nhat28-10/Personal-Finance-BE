import pool from '../db/postgre'
import { Categories } from '../../domain/entites/Categories'
import { ICategoryRepository } from '../../domain/repositories/ICategoryRepository'

export class CategoryRepositoryImp implements ICategoryRepository {
  async getAllCategories(): Promise<Categories[]> {
    const query = `SELECT * FROM categories`
    const result = await pool.query(query)
    return result.rows
  }

  async getCategoryById(category_id: number): Promise<Categories | null> {
    const query = `SELECT * FROM categories WHERE category_id = $1 `
    const result = await pool.query(query, [category_id])
    return result.rows[0] || null
  }
  // Tạo category không cho người dùng nhập vào id ở Categories object
  // Truyền vào name, type, description, image
  // trả về category vừa được tạo
  async createCategory(category: Omit<Categories, 'category_id'>): Promise<Categories> {
    const query = `INSERT INTO categories (name, type, description, image) 
        VALUES ($1,$2,$3,$4) RETURNING *`
    const result = await pool.query(query, [category.name, category.type, category.description, category.image])
    return result.rows[0]
  }
  async updateCategory(category_id: number, category: Partial<Omit<Categories, 'category_id'>>): Promise<Categories> {
    const fields = []
    const values = []
    let index = 1
    for (const [key, value] of Object.entries(category)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }
    values.push(category_id)
    const query = `
        UPDATE categories 
        SET ${fields.join(', ')}
        WHERE category_id = $${index}
        RETURNING *
      `
    const result = await pool.query(query, values)
    return result.rows[0]
  }
  async deleteCategory(category_id: number): Promise<boolean> {
    const query = `DELETE FROM categories WHERE category_id = $1`
    const result = await pool.query(query, [category_id])
    return result.rowCount > 0
  }
}
