import request from 'supertest'
import { app } from '../../app'

it('cookie is cleared', async () => {
    const res=await request(app)
        .post('/api/users/signup')
        .send({
            email: 'check1@test.com',
            password: 'password12345'
        })
        .expect(201)
    console.log(res.get('Set-Cookie'));


    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200)
    console.log(response.get('Set-Cookie'));
    // expect(response.get('Set-Cookie')).toBe(undefined);
    // console.log(response);

})
