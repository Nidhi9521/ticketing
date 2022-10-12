import { Listener, OrderCancelledEvent, Subjects } from "@ndgokani9521/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../model/ticket";
import { queueGroup } from './queue-group-name'
import { TicketUpdatedPublisher } from "../publishers/ticket-update-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    // queueGroupName: string;
    queueGroup = queueGroup;


    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        console.log('check listen');
        console.log(data);

        console.log(data.ticket.id.toString());

        const ticket = await Ticket.findById({ _id: data.ticket.id });

        if (!ticket) {
            throw new Error('Ticket not found')
        }
        ticket.set({ orderId: null });

        await ticket.save();
        console.log('hii');
        console.log(ticket);


        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });
        msg.ack();
    }
} 