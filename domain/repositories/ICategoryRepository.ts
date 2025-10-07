import { Categories } from "../entites/Categories"

export interface ICategoryRepository {
  getAllCategory():Promise<Categories[]>
  getCategoryById(category_id:number):Promise<Categories | null>
  createCategory(category:Omit<Categories, "category_id">):Promise<Categories>
  updateCategory(category_id:number, category:Partial<Omit<Categories, "category_id">>):Promise<Categories>
  deleteCategory(category_id:number):Promise<boolean>
}