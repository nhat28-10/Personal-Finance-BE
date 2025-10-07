import pool from '../db/postgre'
import { Budget } from '../../domain/entites/Budgets'
import { IBudgetRepository } from '../../domain/repositories/IBudgetRepository'

export class BudgetRepositoryImp implements IBudgetRepository {
  async getAllBudget(user_id: number): Promise<Budget[]> {
    const query = `SELECT * FROM budget WHERE user_id = $1`
    const result = await pool.query(query, [user_id])
    return result.rows
  }
  async getBudgetById(user_id: number, budget_id: number): Promise<Budget | null> {
    const query = `SELECT * FROM budget WHERE user_id = $1 AND budget_id = $2`
    const result = await pool.query(query, [user_id, budget_id])
    return result.rows[0] || null
  }
  async createBudget(
    user_id: number,
    budget: Omit<Budget, 'budget_id' | 'user_id' | 'created_at' | 'updated_at'>
  ): Promise<Budget> {
    const query = `INSERT INTO budget (user_id, category_id, amount, started_date, end_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`
    const result = await pool.query(query, [
      user_id,
      budget.category_id,
      budget.amount,
      budget.started_date,
      budget.end_date
    ])
    return result.rows[0]
  }

  async updateBudget(
    user_id: number,
    budget_id: number,
    budget: Partial<Omit<Budget, 'budget_id' | 'user_id' | 'created_at'>>
  ): Promise<Budget | null> {
    const fields: string[] = []
    const values: any[] = []
    let index = 1

    for (const [key, value] of Object.entries(budget)) {
      fields.push(`${key} = $${index}`)
      values.push(value)
      index++
    }

    fields.push(`updated_at = NOW()`)

    // push điều kiện WHERE
    values.push(user_id)
    values.push(budget_id)

    const query = `
    UPDATE budget
    SET ${fields.join(', ')}
    WHERE user_id = $${index} AND budget_id = $${index + 1}
    RETURNING *
  `

    const result = await pool.query(query, values)
    return result.rows[0] || null
  }

  async deleteBudget(user_id: number, budget_id: number): Promise<boolean> {
    const query = `DELETE FROM budget WHERE user_id = $1 AND budget_id = $2`
    const result = await pool.query(query, [user_id, budget_id])
    return result.rowCount > 0
  }
}
