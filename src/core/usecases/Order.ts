import { OrderGateway } from '../../adapters/gateway/Order';
import { IOrderService } from '../../core/applications/ports/services/IOrderService';
import { PROCESS_STATUS } from '../../core/domain/Order';
import { OrderEntity } from '../../core/entities/Order';
import { OrderProductEntity } from '../entities/OrderProduct';

export class OrderUseCase {
  private orderGateway: OrderGateway;

  constructor(orderGateway: OrderGateway) {
    this.orderGateway = orderGateway;
  }

  public async create(orderEntity: OrderEntity, orderProductEntity: OrderProductEntity): Promise<OrderEntity> {
    try {
      const newOrderEntity = new OrderEntity(
        orderEntity.id,
        orderEntity.customerId,
        orderEntity.processStage,
        orderEntity.totalAmount,
        orderEntity.paymentStatus,
        orderEntity.createdAt,
        orderEntity.updatedAt
      );

      const newOrderProductEntity = new Array(
        new OrderProductEntity(
          orderProductEntity.id,
          orderProductEntity.orderId,
          orderProductEntity.productId,
          orderProductEntity.quantity,
          orderProductEntity.unitPrice
        )
      );

      const order = await this.orderGateway.create(newOrderEntity, newOrderProductEntity);
      return order;
    } catch (e) {
      throw e;
    }
  }

  public async update(id: number, data: OrderEntity): Promise<OrderEntity | null> {
    try {
      const newOrderEntity = new OrderEntity(
        id,
        data.customerId,
        data.processStage,
        data.totalAmount,
        data.paymentStatus,
        data.createdAt,
        data.updatedAt
      );

      const order = this.orderGateway.update(id, newOrderEntity);
      return order;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const order = this.orderGateway.delete(id);
      return order;
    } catch (e) {
      throw e;
    }
  }

  public async getById(id: number): Promise<OrderEntity | null> {
    try {
      const order = this.orderGateway.getById(id);
      return order;
    } catch (e) {
      throw e;
    }
  }

  getAll: IOrderService['getAll'] = async (payload = {}) => {
    try {
      const order = this.orderGateway.getAll(payload);
      return order;
    } catch (e) {
      throw e;
    }
  };

  public async getByStatus(status: PROCESS_STATUS): Promise<OrderEntity[]> {
    try {
      const order = this.orderGateway.getByStatus(status);
      return order;
    } catch (e) {
      throw e;
    }
  }

  public async getByCreationDate(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
    try {
      const order = this.orderGateway.getByCreationDate(startDate, endDate);
      return order;
    } catch (e) {
      throw e;
    }
  }

  public async getByUpdateDate(startDate: Date, endDate: Date): Promise<OrderEntity[]> {
    try {
      const order = this.orderGateway.getByUpdateDate(startDate, endDate);
      return order;
    } catch (e) {
      throw e;
    }
  }
}
