import { Budget } from "../entites/Budgets"

export interface IBudgetRepository {
  getAllBudget(user_id: number): Promise<Budget[]>
  getBudgetById(user_id: number, budget_id: number): Promise<Budget | null>
  createBudget(
    user_id: number,
    budget: Omit<Budget, "budget_id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Budget>
  updateBudget(
    user_id: number,
    budget_id: number,
    budget: Partial<Omit<Budget, "budget_id" | "user_id" | "created_at">>
  ): Promise<Budget | null>
  deleteBudget(user_id: number, budget_id: number): Promise<boolean>
}
