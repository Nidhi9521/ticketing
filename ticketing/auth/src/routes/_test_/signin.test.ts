import request from 'supertest'
import { app } from '../../app'

it('fails when a eamil does not exist is supplied', async () => {
    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        }).expect(400)
})

it('fails when an incorrect password suplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'check@test.com',
            password: 'password1234'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'check@test.com',
            password: 'passfhbdfgword'
        }).expect(400)

})

it('signin signup with correct id password', async () => {
    var response=await request(app)
        .post('/api/users/signup')
        .send({
            email: 'check1@test.com',
            password: 'password12345'
        })
        .expect(201)
        console.log(response.get('Set-Cookie'));
        

    await request(app)
        .post('/api/users/signin')
        .send({
            email: 'check1@test.com',
            password: 'password12345'
        }).expect(200)

})