import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@ndgokani9521/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/orders";
import { queueGroup } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroup = queueGroup;

    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {

        const order=await Order.findById(data.orderId);

        if(!order){
            throw new Error('Order not found')
        }
        order.set({
            status:OrderStatus.Complete
        });

        await order.save();

        msg.ack();

    }
}