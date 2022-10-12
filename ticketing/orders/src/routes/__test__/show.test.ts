import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { Order } from '../../models/orders'
import { Ticket } from '../../models/ticket'
import { OrderStatus } from '@ndgokani9521/common'


const buildTicket = async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        id: new mongoose.Types.ObjectId().toHexString()
    })
    await ticket.save();
    return ticket;
}


it('fetches the order', async () => {

    const ticketOne = await buildTicket();
    const userOne = global.signin();

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    const { body: response } = await request(app)
        .get(`/api/orders/${orderOne.id}`)
        .set('Cookie', userOne)
        .send({})
        .expect(200)
    console.log(response);

    expect(orderOne.id).toEqual(response.id)


})


it('fetches the order of differnt users', async () => {

    const ticketOne = await buildTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    const { body: orderOne } = await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    const { body: response } = await request(app)
        .get(`/api/orders/${orderOne.id}`)
        .set('Cookie', userTwo)
        .send({})
        .expect(401)
    console.log(response);

})