import pool from "../db/postgre"
import { Wallets } from "../../domain/entites/Wallets"
import { IWalletRepository } from "../../domain/repositories/IWalletRepository"

export class WalletRepositoryImp implements IWalletRepository {
  async getAllWallet(user_id: number): Promise<Wallets[]> {
      const result = await pool.query("SELECT * FROM wallets WHERE user_id = $1",[user_id])
      return result.rows
  }
  async getWalletById(wallet_id: number, user_id:number): Promise<Wallets | null> {
      const result = await pool.query("SELECT * FROM wallets WHERE wallet_id = $1 AND user_id = $2",[wallet_id,user_id])
      return result.rows[0] || null
  }
  async createWallet(wallet: Omit<Wallets, "wallet_id" | "created_at" | "updated_at">): Promise<Wallets> {
      const result = await pool.query(
        "INSERT INTO wallets (user_id,currency_id, name, balance) VALUES ($1,$2,$3,$4) RETURNING *"
      ,[wallet.user_id,wallet.currency_id, wallet.name, wallet.balance])
      return result.rows[0]
  }
  async updateWallet(wallet_id: number,user_id:number, wallet: Partial<Omit<Wallets, "wallet_id" | "created_at" | "updated_at">>): Promise<Wallets> {
      const fields = []
      const values = []
      let index = 1
      for(const [key,value] of Object.entries(wallet)) {
        fields.push(`${key} = $${index}`)
        values.push(value)
        index++
      }
      fields.push("updated_at = NOW()")
      values.push(wallet_id)
      values.push(user_id)
      const query = `UPDATE wallets SET ${fields.join(", ")} WHERE wallet_id = $${index} AND user_id = $${index + 1} RETURNING *`
      const result = await pool.query(query, values)
      return result.rows[0]
  }
  async deleteWallet(wallet_id: number, user_id: number): Promise<boolean> {
      const result = await pool.query("DELETE FROM wallets WHERE wallet_id = $1 AND user_id = $2",[wallet_id,user_id])
      return result.rowCount > 0
  }
  async changeCurrency(wallet_id: number, user_id: number, newCurrencyId: number): Promise<Wallets> {
      const result = await pool.query(
        `UPDATE wallets SET currency_id = $1, updated_at = NOW()
        WHERE wallet_id = $2 AND user_id = $3
        RETURNING *`,
        [newCurrencyId,wallet_id, user_id]
      )
      return result.rows[0]
  }
}