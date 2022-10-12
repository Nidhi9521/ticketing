import { OrderStatus } from "@ndgokani9521/common";
import mongoose from "mongoose";
import request from "supertest"
import { app } from '../../app';
import { Order } from "../../models/order";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";
// jest.mock('../../stripe')

it('return 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payment')
        .set('Cookie', global.signin())
        .send({ token: 'asdfgh', orderId: new mongoose.Types.ObjectId().toHexString() })
        .expect(404)
})

it('return 401 when purchasing an order that does to user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save();
    await request(app)
        .post('/api/payment')
        .set('Cookie', global.signin())
        .send({ token: 'asdfgh', orderId: order.id })
        .expect(401)
})

it('return 400 when purchasing a cancelled order', async () => {

    const userId = new mongoose.Types.ObjectId().toHexString()

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payment')
        .set('Cookie', global.signin(userId)).expect(400)
})

it('returns a 204 with valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId,
        version: 0,
        price: 20,
        status: OrderStatus.Created
    })

    await order.save()
    console.log(order);

    await request(app).post('/api/payment')
        .set('Cookie', global.signin(userId))
        .send({
            token: 'tok_visa',
            orderId: order.id
        }).expect(201)

    const stripeCharges = await stripe.paymentIntents.list({ limit: 50 })
    const stripeCharge = stripeCharges.data.find((charge) => {


        return charge.amount === order.price * 100
    })
    console.log(stripeCharge);

    expect(stripeCharge).toBeDefined();
    expect(stripeCharge?.currency).toEqual('inr');


    const payment = await Payment.findOne({
        orderId: order.id,
        StripeId: stripeCharge!.id
    })
    expect(payment).toBeDefined();
})  