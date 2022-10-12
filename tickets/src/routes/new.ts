import express, { Request, Response } from 'express';
import { requireAuth, validationRequest } from '@ndgokani9521/common';
import { body } from 'express-validator';
import { Ticket } from '../model/ticket';
import { app } from '../app';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
const router = express.Router();

router.post('/api/tickets',
   requireAuth,
   [
      body('title').not().isEmpty().withMessage('Title is requires'),
      body('price').isFloat({ gt: 0 }).withMessage('Price is not valid')
   ], validationRequest,
   async (req: Request, res: Response) => {
      console.log('ticket post');

      const { title, price } = req.body;

      const ticket = Ticket.build({
         title,
         price,
         userId: req.currentUser!.id
      })

      await ticket.save()

      await new TicketCreatedPublisher(natsWrapper.client).publish({
         id: ticket.id,
         title: ticket.title,
         price: ticket.price,
         userId: ticket.userId,
         version: ticket.version
      })
      res.status(201).send(ticket);
   })

export { router as TicketRouter };