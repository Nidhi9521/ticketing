import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ndgokani9521/common";
import { Message } from "node-nats-streaming";
import { queueGroup } from "./queue-group-name";
import { Order } from "../../models/order";
export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;

    queueGroup = queueGroup;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        console.log('data at payment service', data);

        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        })

        await order.save();
        msg.ack();
    }
}