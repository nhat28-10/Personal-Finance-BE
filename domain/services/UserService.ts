import bcrypt from 'bcrypt'
import { Users } from "../entites/Users";
import { IUserRepository } from "../repositories/IUserRepository";
import { UserRepositoryImp } from "../../infracstructure/repositories/UserRepositoryImp";

export class UserService {
  private userRepository : IUserRepository;

  constructor (userRepository ?: IUserRepository) {
    this.userRepository = userRepository || new UserRepositoryImp();
  }

  async getAllUser():Promise<Users[]> {
    return await this.userRepository.getAllUsers();
  }
  async getUserById(user_id:number):Promise<Users | null> {
    const user = await this.userRepository.getUserById(user_id);
    if(!user) {
      throw new Error(`Can not found with this ${user_id}`);
    }
    return user;
  }
  async createUser(user:Omit<Users, 'user_id' | 'created_at' | 'updated_at'>):Promise<Users> {
    // check duplicate email
    const existingUsers = await this.userRepository.getAllUsers();
    if(existingUsers.some(u => u.email === user.email)) {
      throw new Error("Email alreay exist");
    }
    // hash password before saving
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds)
    // call repository for creating new user
    const newUser = await this.userRepository.createUser({
      ...user,
      password:hashedPassword
    });
    //(optional) Delete password before returning to FE
    delete (newUser as any).password
    return newUser;
  }
  async updateUser(user_id:number, user: Partial<Omit<Users, 'user_id' | 'created_at'>>): Promise<Users> {
    const existing = await this.userRepository.getUserById(user_id);
    if (!existing) {
      throw new Error(`User with this ID ${user_id} not found`)
    }
    return await this.userRepository.updateUser(user_id, user);
  }
  async deleteUser(user_id: number):Promise<boolean> {
    const existing = await this.userRepository.getUserById(user_id)
    if(!existing) {
      throw new Error(`User with this ID ${user_id} not found`)
    }
    return await this.userRepository.deleteUser(user_id)
  }
} 