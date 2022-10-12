import { Listener } from "./base-listener";
import { Message } from "node-nats-streaming";
import { Subjects } from "./subjects";
import { TicketCreatedEvent } from "./ticket-created-event";
export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject:(Subjects.TicketCreated )= Subjects.TicketCreated;
    
    queueGroup='payments-service';
    onMessage(data:TicketCreatedEvent['data'],msg:Message){
        console.log('Event data!',data);
        console.log(data.title);
        console.log(data.price);
        msg.ack();
    }
}