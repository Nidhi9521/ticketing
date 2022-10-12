import { Message } from "node-nats-streaming";
import { Subjects,Listener,TicketCreatedEvent } from "@ndgokani9521/common";
import { Ticket } from "../../models/ticket";
import { queueGroup } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    queueGroup=queueGroup;
    subject: Subjects.TicketCreated=Subjects.TicketCreated;
    async onMessage(data:TicketCreatedEvent['data'],msg:Message){
         const {id,title,price}=data;
         const ticket = Ticket.build({
            id,title,price
         })
         await ticket.save();
         msg.ack();
    }
}
    