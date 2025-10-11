import { Wallets } from "../entites/Wallets";
import { IWalletRepository } from "../repositories/IWalletRepository";
import { WalletRepositoryImp } from "../../infracstructure/repositories/WalletRepositoryImp";

export class WalletService {
  private walletRepository: IWalletRepository;
  
  constructor(walletRepository?: IWalletRepository) {
    this.walletRepository = walletRepository || new WalletRepositoryImp();
  }

  async getAllWallet(user_id: number):Promise<Wallets[]> {
    const wallets = await this.walletRepository.getAllWallet(user_id) 
    return wallets;
  }

  async getWalletById(wallet_id: number, user_id: number): Promise<Wallets | null> {
    const wallet = await this.walletRepository.getWalletById(wallet_id, user_id) 
    if(!wallet) {
      throw new Error(`Wallet with ID ${wallet_id} not found or not owned by user ${user_id}`)
    }
    return wallet
  }

  async createWallet(wallet: Omit<Wallets, 'wallet_id' | 'created_at' | 'updated_at'>): Promise<Wallets> {
    const newWallet = await this.walletRepository.createWallet(wallet)
    return newWallet;
  }

  async updateWallet(wallet_id: number,user_id: number, wallet: Partial<Omit<Wallets, "wallet_id" | "created_at" | "updated_at">>):Promise<Wallets> {
    const existing = await this.walletRepository.getWalletById(wallet_id, user_id);
    if(!existing) {
      throw new Error(`Wallet not found or not owned by user ${user_id}`)
    }
    const updatedWallet = this.walletRepository.updateWallet(wallet_id,user_id,wallet)
    return updatedWallet  
  }
  async deleteWallet(wallet_id:number, user_id: number):Promise<boolean> {
    const existing = await this.walletRepository.getWalletById(wallet_id, user_id)
    if(!existing) {
      throw new Error(`Wallet not found or not owned by user ${user_id}`)
    }
    return await this.walletRepository.deleteWallet(wallet_id,user_id)
  }
  async changeCurrency(wallet_id: number, user_id: number, newCurrencyId: number): Promise<Wallets> {
    const wallet = await this.walletRepository.getWalletById(wallet_id,user_id);
    if(!wallet) {
      throw new Error(`Wallet not found or not owned by user ${user_id}`)
    }
    return await this.walletRepository.changeCurrency(wallet_id,user_id,newCurrencyId)
  }
}