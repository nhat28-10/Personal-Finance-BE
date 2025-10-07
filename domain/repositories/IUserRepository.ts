import { Users } from "../entites/Users";

export interface IUserRepository {
  getAll():Promise<Users[]>
  getById(user_id: number):Promise<Users | null>
  create(user: Omit<Users, "user_id" | "created_at" | "updated_at">):Promise<Users>
  update(user_id: number, user:Partial<Omit<Users, "user_id" | "created_at">>):Promise<Users>
  delete(user_id:number):Promise<boolean>
}