export type CategoryType = "INCOME | EXPENSE"
export interface Categories {
  category_id: number,
  name: string,
  type:  CategoryType,
  description: string,
  image:string,
}