import { Currencies } from "../entites/Currencies";

export interface ICurrencyRepository {
  getAllCurrencies():Promise<Currencies[]>
  findCurrencyId(currency_id: number):Promise<Currencies | null>
  createCurrency(currency: Partial<Omit<Currencies, "currency_id">>):Promise<Currencies>
  updateCurrency(currency_id: number,currency: Partial<Omit<Currencies, "currency_id">>):Promise<Currencies>
  deleteCurrency(currency_id:number):Promise<boolean>
}