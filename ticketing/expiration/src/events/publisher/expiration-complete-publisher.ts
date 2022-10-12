import { Subjects, Publisher, ExpirationCompleteEvent } from "@ndgokani9521/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;


}