import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ForbiddenError } from 'apollo-server-errors';
import { Category } from 'src/category/entities/category.entity';
import { Order } from 'src/order/entities/order.entity';
import { Repository } from 'typeorm';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductService {
  /**
   *
   * Inject to database repository
   *
   */
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  /**
   * Create product
   *
   * @param createProductInput
   * @returns Created product
   */
  async create(createProductInput: CreateProductInput): Promise<Product> {
    //Check exist product name
    const product = await this.productRepository.findOne({
      name: createProductInput.name,
    });
    if (product) {
      throw new ForbiddenError('Product already existed.');
    }

    //Create new product instance
    const newProduct = this.productRepository.create(createProductInput);

    //Add category relation
    const category = await this.categoryRepository.findOne({
      where: { id: createProductInput.categoryId },
      relations: ['product'],
    });
    if (!category) {
      throw new ForbiddenError('Category not found');
    }
    category.product.push(newProduct);

    //Save to db
    await this.productRepository.save(newProduct);
    await this.categoryRepository.save(category);

    return newProduct;
  }

  /**
   * Show all product
   *
   * @returns List of product
   */
  async findAll(): Promise<Product[]> {
    const products = await this.productRepository.find({
      relations: ['category', 'order'],
    });
    if (!products) {
      throw new ForbiddenError('Product not found');
    }
    return products;
  }

  async findOne(id: number): Promise<Product> {
    this.countStock(id);
    return await this.productRepository.findOneOrFail({
      where: { id: id },
      relations: ['category', 'order'],
    });
  }

  async update(
    id: number,
    updateProductInput: UpdateProductInput,
  ): Promise<Product> {
    const product = await this.productRepository.findOne(id);

    if (!product) {
      throw new ForbiddenError('Product not found.');
    }
    const updated = Object.assign(product, updateProductInput);

    return await this.productRepository.save(updated);
  }

  async remove(id: number): Promise<string> {
    const product = await this.productRepository.findOne(id);
    if (!product) {
      throw new ForbiddenError('Product not found.');
    }

    await this.productRepository.delete(id);
    return 'Delete success!';
  }

  async countStock(id: number): Promise<number> {
    let stock = 0;
    const product = await this.orderRepository.find({
      select: ['quantity'],
      where: { product: id },
    });
    if (!product) {
      throw new ForbiddenError('Product not found');
    }
    product.forEach((element) => {
      stock += element.quantity;
    });
    return stock;
  }
}
