import  request  from "supertest";
import { app } from "../../app";

it('return 201 on singup success',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'12345678'
    })
    .expect(201);
})

it('returns a 400 with an invalid email',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'testtest.com',
        password:'12345678'
    })
    .expect(400);
})

it('returns a 400 with an invalid password',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'1'
    })
    .expect(400);
})

it('returns a 400 with an missing email & password',async()=>{
    return request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
})

it('returns a 400 with an missing email & password',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com'
    })
    .expect(400);
    await request(app)
    .post('/api/users/signup')
    .send({
        password:'testtest'
    })
    .expect(400);
})

it('disallows duplicate emails',async()=>{
    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'12345678'
    })
    .expect(201);

    await request(app)
    .post('/api/users/signup')
    .send({
        email:'test@test.com',
        password:'12345678'
    })
    .expect(400);
})

it('sets a cookie after sucessful signup',async()=>{

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email:'test@test.com',
            password:'12345678'
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();

})

