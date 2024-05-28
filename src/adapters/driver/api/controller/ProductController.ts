import { Request, Response } from 'express';
import { IProductService } from '../../../../core/applications/ports/services/IProductService';
import { CreateProductDto, UpdateProductDto } from './dto/ProductDto';

export class ProductController {
  private productService: IProductService;

  constructor(productService: IProductService) {
    this.productService = productService;
  }

  async createProduct(req: Request, res: Response): Promise<Response> {
    const createProductDto: CreateProductDto = req.body;
    const product = await this.productService.create(createProductDto);
    return res.status(201).json(product);
  }

  async updateProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id, 10);
    const updateProductDto: UpdateProductDto = req.body;
    const product = await this.productService.update(id, updateProductDto);
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  }

  async deleteProduct(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id, 10);
    await this.productService.delete(id);
    return res.status(204).send();
  }

  async getProductById(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id, 10);
    const product = await this.productService.getById(id);
    if (product) {
      return res.json(product);
    } else {
      return res.status(404).json({ message: 'Product not found' });
    }
  }

  async getAllProducts(req: Request, res: Response): Promise<Response> {
    // get category from query params
    const category = req.query.category as string;
    const products = await this.productService.getAll({ category });
    return res.status(200).json(products);
  }
}
