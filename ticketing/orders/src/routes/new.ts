import express, { Request, Response } from "express";
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validationRequest } from "@ndgokani9521/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from '../models/ticket';
import { Order } from "../models/orders";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1 * 60
router.post('/api/orders',
    requireAuth, [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
        .withMessage('TicketId must be provided')
], validationRequest,
    async (req: Request, res: Response) => {

        const { ticketId } = req.body;


        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {

            throw new NotFoundError();
        }
        const isReserved = await ticket.isReserved();

        // const existingOrder= await Order.findOne({
        //     ticket:ticket,
        //     status:{
        //         $in:[
        //             OrderStatus.Created,
        //             OrderStatus.AwaitingPayment,
        //             OrderStatus.Complete
        //         ]
        //     }
        // })

        if (isReserved) {

            throw new BadRequestError('Ticket is already reserved');
        }

        const expiration = new Date();

        expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

        const order = Order.build({
            userId: req.currentUser?.id || '',
            status: OrderStatus.Created,
            expiresAt: expiration,
            ticket,
        })
        await order.save();
        await new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id, version: order.version, userId: order.userId, status: order.status, expiresAt: order.expiresAt, ticket: { id: order.ticket.id, price: order.ticket.price }
        })
        res.status(201).send(order);
    })

export { router as newOrderRouter }