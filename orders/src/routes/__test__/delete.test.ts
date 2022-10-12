import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/orders'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@ndgokani9521/common'
import { natsWrapper } from '../../nats-wrapper'

const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save();
    return ticket;
}

it('update the order', async () => {

    const ticketOne = await buildTicket();
    const userOne = global.signin();

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    const { body: response } = await request(app)
        .put(`/api/orders/${orderOne.id}`)
        .set('Cookie', userOne)
        .send({})
        .expect(204)
    console.log(response);

    const updatedOrder = await Order.findById(orderOne.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)

}) 

it('emits a order cancelled event ',async()=>{
    const ticketOne = await buildTicket();
    const userOne = global.signin();

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    const { body: response } = await request(app)
        .put(`/api/orders/${orderOne.id}`)
        .set('Cookie', userOne)
        .send({})
        .expect(204)
    console.log(response);
  
    expect(natsWrapper.client.publish).toHaveBeenCalled()
})
