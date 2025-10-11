import {Budget} from '../entites/Budgets'
import {IBudgetRepository} from '../repositories/IBudgetRepository'
import {BudgetRepositoryImp} from '../../infracstructure/repositories/BudgetRepositoryImp'

export class BudgetService {
  private budgetRepositry : IBudgetRepository
  constructor(budgetRepository?: IBudgetRepository) {
    this.budgetRepositry = budgetRepository || new BudgetRepositoryImp();
  }

  async getAllBudget(user_id: number): Promise<Budget[]> {
    const budgets = await this.budgetRepositry.getAllBudget(user_id)
    return budgets
  }
  async getBudgetById(user_id: number, budget_id: number): Promise<Budget | null> {
    const budget = await this.budgetRepositry.getBudgetById(user_id,budget_id)
    if (!budget) {
      throw new Error(`Budget with ID ${budget_id} not found or not owned by user ${user_id}`)
    }
    return budget;
  }
  async createBudget(
    user_id: number,
    budget: Omit<Budget, "budget_id" | "user_id" | "created_at" | "updated_at">
  ): Promise<Budget> {
    const newBudget = await this.budgetRepositry.createBudget(user_id, budget)
    return newBudget
  }

  async updateBudget(
    user_id: number,
    budget_id: number,
    budget: Partial<Omit<Budget, "budget_id" | "user_id" | "created_at">>
  ): Promise<Budget | null> {
    const existing = await this.budgetRepositry.getBudgetById(user_id,budget_id)
    if(!existing) {
      throw new Error(`Budget with ID ${budget_id} not found or not owned by user ${user_id}`)
    }
    const updatedBudget = await this.budgetRepositry.updateBudget(user_id,budget_id,budget)
    return updatedBudget;
  }

  async deleteBudget(user_id: number, budget_id: number): Promise<boolean> {
    const existing = await this.budgetRepositry.getBudgetById(user_id,budget_id)
    if(!existing) {
      throw new Error(`Budget with ID ${budget_id} not found or not owned by user ${user_id}`)
    }
    return await this.budgetRepositry.deleteBudget(user_id,budget_id)
  }
}