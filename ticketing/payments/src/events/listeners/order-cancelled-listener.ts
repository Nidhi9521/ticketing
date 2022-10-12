import { Listener, OrderCancelledEvent, OrderStatus, Subjects } from "@ndgokani9521/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroup } from "./queue-group-name";
export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  queueGroup = queueGroup;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    console.log('dat at payment', data);

    const order = await Order.findOne({
      id: data.id
    })
    
    if (!order) {
      throw new Error('order not found')
    }

    order.set({ status: OrderStatus.Cancelled });

    await order.save();
    msg.ack();
  }

}