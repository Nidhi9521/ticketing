import { Subjects,OrderCancelledEvent,Publisher } from "@ndgokani9521/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled=Subjects.OrderCancelled;
}