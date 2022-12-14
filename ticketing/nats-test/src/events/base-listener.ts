import { Stan,Message } from "node-nats-streaming";
import {Subjects} from "./subjects"
interface Event{
    subject:Subjects;
    data:any;  
}

export abstract class Listener<T extends Event>{
    abstract subject :T['subject'];
    abstract queueGroup:string;
    private client:Stan;
    protected ackWait=5*1000;
    abstract onMessage(data:T['data'],msg:Message):void;
    constructor(client:Stan){
        this.client=client;
    }
    subscriptionOptions(){
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroup); 
    }
    listen(){
        const subscription = this.client.subscribe(
            this.subject,
            this.queueGroup,
            this.subscriptionOptions()
        )

        subscription.on('message',(msg:Message)=>{
            console.log(
                `Message received:  ${this.subject}  /QueueGroupName: ${this.queueGroup} `
            )
            const parsedData=this.parseMessage(msg);
            this.onMessage(parsedData,msg); 
        })

        
    }
    parseMessage(msg:Message){
        const data=msg.getData(); 
        return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'))
    }
}
