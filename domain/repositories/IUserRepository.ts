import { Users } from "../entites/Users";

export interface IUserRepository {
  getAllUsers():Promise<Users[]>
  getUserById(user_id: number):Promise<Users | null>
  createUser(user: Omit<Users, "user_id" | "created_at" | "updated_at">):Promise<Users>
  updateUser(user_id: number, user:Partial<Omit<Users, "user_id" | "created_at">>):Promise<Users>
  deleteUser(user_id:number):Promise<boolean>
  getUserByEmail(email:string):Promise<Users | null>
}