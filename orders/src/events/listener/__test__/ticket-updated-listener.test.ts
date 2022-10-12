import { Message } from 'node-nats-streaming'
import { TicketUpdatedEvent } from "@ndgokani9521/common"
import mongoose from "mongoose"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from '../../../models/ticket'
import { TicketUpdatedListener } from '../ticket-updaated-listener'
const setup = async () => {

    //create an instance of the listener
    const listener = new TicketUpdatedListener(natsWrapper.client)

    //create a fake data event
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'Concert',
        price: 10,
    })
    await ticket.save();

    const data: TicketUpdatedEvent['data'] = {
        version: ticket.version + 1,
        id: ticket.id,
        title: 'Concert-check',
        price: 100,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    //create a fake message object
    //@ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    };

    //return all of this stuff
    return { listener, data, msg, ticket }

}

it('finds,update, and saves a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
})

it('acks the message', async () => {

    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})
it('do not call ack if the event has a skipped version number', async () => {

    const { msg, data, listener, ticket } = await setup();
    data.version = 10;

    try {
        await listener.onMessage(data, msg)
    } catch (err) {

    }

    expect(msg.ack).not.toHaveBeenCalled();


})