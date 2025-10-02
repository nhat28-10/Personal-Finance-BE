import pool from "../db/postgre";

type CategoryType = "INCOME | EXPENSE"
export interface Category {
  category_id: number,
  name: string,
  type:  CategoryType,
  description: string,
  image:string,
}

export const CategoryModels = {
  async getAll():Promise<Category[]> {
    const result = await pool.query('SELECT * FROM categories')
    return result.rows
  },
  async getById(category_id: number):Promise<Category | null> {
    const result = await pool.query('SELECT * FROM categories WHERE category_id = $1',[category_id])
    return result.rows[0] || null
  },
  async create(category: Omit<Category, "category_id">):Promise<Category> {
   const {name, type, description, image} = category;
   const result = await pool.query('INSERT INTO categories(name, type, description, image) VALUES($1, $2, $3, $4) RETURNING *',[name, type, description, image]);
   return result.rows[0];
  },
  async update(category_id: number, category:Omit<Category, "category_id">):Promise<Category> {
    const {name, type, description, image} = category;
    const fields = [];
    const values = [];
    let index = 1;
    for (const [key, value] of Object.entries(category)) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index++;
    }
    const query = `
      UPDATE categories
      SET ${fields.join(',')}
      WHERE category_id = $${index}
      RETURNING *`
      values.push(category_id)
      const result = await pool.query(query,values);
      return result.rows[0]
  },
  async delete(category_id: number):Promise<boolean> {
    const result = await pool.query('DELETE FROM categories WHERE category_id = $1',[category_id])
    return result.rowCount > 0
  }
}