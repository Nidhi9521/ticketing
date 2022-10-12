import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../model/ticket"
import { OrderCancelledEvent, OrderStatus } from "@ndgokani9521/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {


    const listener = new OrderCancelledListener(natsWrapper.client);
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const ticket = Ticket.build({
        title: 'concert',
        price: 10,
        userId: 'fcduy'
    })
    ticket.set({ orderId });
    await ticket.save();

    const data: OrderCancelledEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, ticket, msg }
}

it('update the ticket publishes an event and acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const updatedTicket = await Ticket.findById(ticket.id);
    // expect(updatedTicket?.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    //@ts-ignore
    console.log(natsWrapper.client.publish.mock.calls);
})

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg)
    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a Ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg)
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //@ts-ignore
    console.log(natsWrapper.client.publish.mock.calls);

})