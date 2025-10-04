import { Wallets } from "../entites/Wallets";

export interface IWalletRepository {
  getAllWallet(user_id: number):Promise<Wallets[]>
  getWalletById(wallet_id:number, user_id: number):Promise<Wallets | null>
  createWallet(wallet: Omit<Wallets, "wallet_id" | "created_at" | "updated_at">):Promise<Wallets>
  updateWallet(wallet_id: number,user_id: number, wallet: Partial<Omit<Wallets, "wallet_id" | "created_at" | "updated_at">>):Promise<Wallets>
  deleteWallet(wallet_id:number, user_id: number):Promise<boolean>
  changeCurrency(wallet_id:number, user_id:number, newCurrencyId: number):Promise<Wallets> 
}