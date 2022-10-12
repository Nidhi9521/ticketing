import {
  Listener,
  OrderCreatedEvent,
  OrderStatus,
  Subjects,
} from "@ndgokani9521/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";
import { queueGroup } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroup: string = queueGroup;
  async onMessage(
    data: {
      id: string;
      userId: string;
      version: number;
      status: OrderStatus;
      expiresAt: Date;
      ticket: { id: string; price: number };
    },
    msg: Message
  ) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting Delay:', delay);

    await expirationQueue.add({
      orderId: data.id,
    },
      {
        delay: 20000
      }
    );
    msg.ack();
  }
}
