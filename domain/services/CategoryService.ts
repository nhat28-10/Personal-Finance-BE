import { Categories } from "../entites/Categories";
import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { CategoryRepositoryImp } from "../../infracstructure/repositories/CategoryRepositoryImp";

export class CategoryService {
  private categoryRepository: ICategoryRepository;

  constructor(categoryRepository?: ICategoryRepository) {
    this.categoryRepository = categoryRepository || new CategoryRepositoryImp();
  }

  async getAllCategories(): Promise<Categories[]> {
    return await this.categoryRepository.getAllCategories();
  }

  async getCategoryById(category_id: number): Promise<Categories> {
    const exist = await this.categoryRepository.getCategoryById(category_id);
    if (!exist) {
      throw new Error(`Category with ID ${category_id} cannot be found`);
    }
    return exist;
  }

  async createCategory(category: Omit<Categories, "category_id">): Promise<Categories> {
    return await this.categoryRepository.createCategory(category);
  }

  async updateCategory(
    category_id: number,
    category: Partial<Omit<Categories, "category_id">>
  ): Promise<Categories> {
    const exist = await this.categoryRepository.getCategoryById(category_id);
    if (!exist) {
      throw new Error(`Category with ID ${category_id} cannot be found`);
    }
    return await this.categoryRepository.updateCategory(category_id, category);
  }

  async deleteCategory(category_id: number): Promise<boolean> {
    const exist = await this.categoryRepository.getCategoryById(category_id);
    if (!exist) {
      throw new Error(`Category with ID ${category_id} cannot be found`);
    }
    return await this.categoryRepository.deleteCategory(category_id);
  }
}
