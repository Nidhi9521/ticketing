import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth } from "@ndgokani9521/common";
import express, { Request, Response } from "express";
import { Order } from "../models/orders";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.put('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {

    const orderId = req.params.orderId;
    const userId = req.currentUser?.id

    const order = await Order.findById(orderId).populate('ticket')

    if (!order) {
        throw new NotFoundError();
    }
    if (order.userId !== userId) {
        throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();
    console.log('log order cacnel', order);

    await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id, version: order.version, ticket: { id: order.ticket.id, price: order.ticket.price, }
    })
    res.status(204).send(order)



})

export { router as deleteOrderRouter }