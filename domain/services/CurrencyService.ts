import { Currencies } from "../entites/Currencies";
import { ICurrencyRepository } from "../repositories/ICurrencyRepository";
import {CurrencyRepositoryImp} from '../../infracstructure/repositories/CurrencyRepositoryImp'

export class CurrencyService {
  private currencyRepositry : ICurrencyRepository
  constructor(currencyRepository?: ICurrencyRepository) {
    this.currencyRepositry = currencyRepository || new CurrencyRepositoryImp();
  }

  async getAllCurrencies():Promise<Currencies[]> {
    return await this.currencyRepositry.getAllCurrencies();
  }
  async findCurrencyId(currency_id: number):Promise<Currencies | null> {
    const existing = await this.currencyRepositry.findCurrencyId(currency_id)
    if(!existing) {
      throw new Error(`Currency with ID ${currency_id} not found`)
    }
    return existing
  }
  async createCurrency(currency: Partial<Omit<Currencies, "currency_id">>):Promise<Currencies> {
    const newCurrency = await this.currencyRepositry.createCurrency(currency)
    return newCurrency;
  }
  async updateCurrency(currency_id: number,currency: Partial<Omit<Currencies, "currency_id">>):Promise<Currencies> {
    const existing = await this.currencyRepositry.findCurrencyId(currency_id)
    if(!existing) {
      throw new Error(`Currency with ID ${currency_id} not found`)
    }
    const updatedCurrency = await this.currencyRepositry.updateCurrency(currency_id,currency)
    return updatedCurrency
  }
  async deleteCurrency(currency_id:number):Promise<boolean> {
     const existing = await this.currencyRepositry.findCurrencyId(currency_id)
    if(!existing) {
      throw new Error(`Currency with ID ${currency_id} not found`)
    }
    return await this.currencyRepositry.deleteCurrency(currency_id)
  }
}