import { Subjects,TicketUpdatedEvent,Publisher } from "@ndgokani9521/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated=Subjects.TicketUpdated;
}