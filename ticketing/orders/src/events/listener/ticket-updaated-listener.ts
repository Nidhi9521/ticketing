import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent } from "@ndgokani9521/common";
import { Ticket } from "../../models/ticket";
import { queueGroup } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    queueGroup = queueGroup;
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findOne({
            _id:data.id,
            version:data.version-1
        })
        // const ticket = await Ticket.findById(data.id);

        if (!ticket) {
            throw new Error('Ticket not found')
        }

        const { title, price } = data;
        ticket.set({ title, price });
        await ticket.save();
        msg.ack();

    }
}    