import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { TicketCreatedListener } from "./events/listener/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listener/ticket-updaated-listener";
import { ExpirationCompleteListener } from "./events/listener/expiration-complete-listener";
import { PaymentCreatedListener } from "./events/listener/payment-created-listener";
const start = async () => {

    if (!process.env.jwt) {
        throw new Error('env not defiend')
    }
    if (!process.env.MONGO_URI) {
        throw new Error('env not defiend')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('env not defiend')
    }
    if (!process.env.NATS_URL) {
        throw new Error('env not defiend')
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('env not defiend')
    }

    try {
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        })

        process.on('SIGINT', () => natsWrapper.client!.close())
        process.on('SIGTREM  ', () => natsWrapper.client!.close())
        new TicketCreatedListener(natsWrapper.client).listen();
        new TicketUpdatedListener(natsWrapper.client).listen();
        new ExpirationCompleteListener(natsWrapper.client).listen();
        new PaymentCreatedListener(natsWrapper.client).listen();
        await mongoose.connect(process.env.MONGO_URI)
    } catch (err) {
        console.log(err);
    }

    app.listen(4000, () => {
        console.log('port serving at 4001');
    })
}

start();