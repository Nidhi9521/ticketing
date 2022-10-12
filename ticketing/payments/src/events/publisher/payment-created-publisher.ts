
import { Publisher, PaymentCreatedEvent, Subjects } from "@ndgokani9521/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}