import { Subjects,OrderCreatedEvent,Publisher } from "@ndgokani9521/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated=Subjects.OrderCreated;
}