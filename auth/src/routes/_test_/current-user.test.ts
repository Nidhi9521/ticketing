import request from 'supertest'
import { app } from '../../app'

it('responds with details about the current user', async () => {


    const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200)

    expect(response.body.currentUser.email).toEqual('test@test.com')
    console.log(response.body);

})


it('responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('api/users/currentuser')
        .send({})
        .expect(404);
    expect(response.statusCode).toStrictEqual(404)
    console.log('response', response.statusCode);

})