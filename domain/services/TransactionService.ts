import { Transactions } from "../entites/Transactions";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import {TransactionRepositoryImp} from "../../infracstructure/repositories/TransactionRepositoryImp"

export class TransactionService {
  private transactionRepository : ITransactionRepository
  constructor(transactionRepository ?: ITransactionRepository) {
    this.transactionRepository = transactionRepository || new TransactionRepositoryImp()
  }
  async getAllTransactions(wallet_id: number, category_id?:number):Promise<Transactions[]> {
    const transaction = await this.transactionRepository.getAllTransactions(wallet_id, category_id)
    return transaction
  }
  async getTransactionById(transaction_id: number, wallet_id: number):Promise<Transactions | null> {
    const existing = await this.transactionRepository.getTransactionById(transaction_id, wallet_id)
    if(!existing) {
      throw new Error(`Transaction with ID ${transaction_id} can not be found`);
    }
    return existing;
  }
  async createTransaction(wallet_id: number, transaction: Partial<Omit<Transactions, "transaction_id" | "wallet_id" | "created_at" | "updated_at">>): Promise<Transactions> {
  const transactionWithWallet = { ...transaction, wallet_id };
  return await this.transactionRepository.createTransaction(transactionWithWallet);
}
  async updateTransaction(transaction_id: number,wallet_id:number, transaction:Partial<Omit<Transactions, "transaction_id" | "wallet_id">>):Promise<Transactions> {
    const existing = await this.transactionRepository.getTransactionById(transaction_id,wallet_id)
    if(!existing) {
      throw new Error(`Transaction with ID ${transaction_id} can not be found`)
    }
    const updatedTransaction = await this.transactionRepository.updateTransaction(transaction_id,wallet_id,transaction)
    return updatedTransaction
  }
  async deleteTransaction(transaction_id: number, wallet_id:number):Promise<boolean> {
    const existing = await this.transactionRepository.getTransactionById(transaction_id,wallet_id)
    if(!existing) {
      throw new Error(`Transaction with ID ${transaction_id} can not be found`)
    }
    const removedTransaction = await this.transactionRepository.deleteTransaction(transaction_id,wallet_id)
    return removedTransaction
  }
}