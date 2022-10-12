import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model/ticket";
import {natsWrapper} from "../../nats-wrapper";
it('return other status other than 401 if user sign in', async() => {
  var response=await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({}).expect(400)
      console.log(response.statusCode);
      

});
it('has a route handler listening to api/tickets for post request', async () => {
   const response = await request(app)
      .post('/api/tickets')
      .send({});
   console.log(response.status);
   
   expect(response.status).not.toEqual(404)

})
it('can only be accessed if the user is signed in', async () => {
   const response =
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401);

})

it('returns an error if an invalid title is provided', async () => {
   var response=await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
         title:'',
         price:10
      }).expect(400)

      await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
         price:10
      }).expect(400)
      console.log(response.statusCode);
})
it('return an error if and invalid price is provided', async () => {

   await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
         title:'dsvvfgbdf',
         price:-10
      }).expect(400)

      await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signin())
      .send({
         title:'yjgfnnj'
      }).expect(400)
})
it('return error if invalid arguments provided', async () => {
   let tickets = await Ticket.find({});
   expect(tickets.length).toEqual(0);
   const title="qwerty"
   await request(app).post('/api/tickets')
   .set('Cookie',global.signin())
   .send({
      title,
       price:20
   }).expect(201);

   tickets = await Ticket.find({})
   expect(tickets.length).toEqual(1)
   expect(tickets[0].price).toEqual(20) 
   expect(tickets[0].title).toEqual(title);

})

it('publish an event',async()=>{
   const title="qwerty"
   await request(app).post('/api/tickets')
   .set('Cookie',global.signin())
   .send({
      title,
       price:20
   }).expect(201);

   console.log(natsWrapper);
      expect(natsWrapper.client.publish).toHaveBeenCalled()

})