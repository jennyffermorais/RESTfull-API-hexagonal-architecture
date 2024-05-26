import { Request, Response } from 'express';
import { PaymentServiceI } from '../../../../application/port/out/PaymentService';
import { OrderService } from '../../../../application/service/OrderService';
import { PAYMENT_STATUS } from '../../../../domain/model/Order';
import { MarkOrderAsPaidRequest, OrderPaymentRequest } from '../dto/PaymentDto';

export class PaymentController {
  constructor(
    private readonly paymentGatewayService: PaymentServiceI,
    private readonly orderService: OrderService
  ) {}

  async createOrderPayment(req: Request, res: Response): Promise<Response> {
    const { orderId }: OrderPaymentRequest = req.body;
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return res.status(400).json({ message: 'Order already paid' });
    }
    if (order.paymentStatus === PAYMENT_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'Order cancelled' });
    }
    if (order.paymentStatus !== PAYMENT_STATUS.PENDING) {
      return res.status(400).json({ message: 'Order is not in a valid payment status to proceed' });
    }

    const paymentUrl = await this.paymentGatewayService.requestPaymentUrl({ paymentValue: order.totalAmount });

    return res.status(200).json({ paymentUrl });
  }

  async markOrderAsPaid(req: Request, res: Response): Promise<Response> {
    const { orderId, status: paymentResponseStatus }: MarkOrderAsPaidRequest = req.body;
    const order = await this.orderService.getOrderById(orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.paymentStatus === PAYMENT_STATUS.PAID) {
      return res.status(400).json({ message: 'Order already paid' });
    }
    if (order.paymentStatus === PAYMENT_STATUS.CANCELLED) {
      return res.status(400).json({ message: 'Order cancelled' });
    }
    if (order.paymentStatus !== PAYMENT_STATUS.PENDING) {
      return res.status(400).json({ message: 'Order is not in a valid payment status to proceed' });
    }

    if (paymentResponseStatus !== 'PAID') {
      await this.orderService.update(orderId, { paymentStatus: PAYMENT_STATUS.FAILED });
    } else {
      await this.orderService.update(orderId, { paymentStatus: PAYMENT_STATUS.PAID });
    }

    return res.status(200).json({ message: 'Order paid successfully' });
  }
}