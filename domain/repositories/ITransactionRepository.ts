import { Transactions } from "../entites/Transactions";

export interface ITransactionRepository {
  getAllTransactions(wallet_id: number, category_id?:number):Promise<Transactions[]>
  getTransactionById(transaction_id: number, wallet_id: number):Promise<Transactions | null>
  createTransaction(transaction: Partial<Omit<Transactions, "transaction_id" | "wallet_id" | "created_at" | "updated_at">>):Promise<Transactions>
  updateTransaction(transaction_id: number,wallet_id:number, transaction:Partial<Omit<Transactions, "transaction_id" | "wallet_id">>):Promise<Transactions>
  deleteTransaction(transaction_id: number, wallet_id:number):Promise<boolean>
}