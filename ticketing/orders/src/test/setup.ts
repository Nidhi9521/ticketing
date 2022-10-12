import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import request from 'supertest';
import { app } from '../app'
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[];
}
let mongo: any;

jest.mock('../nats-wrapper')
beforeAll(async () => {
    process.env.jwt = 'asdf'
    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
})


beforeEach(async () => {
    jest.clearAllMocks();
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
        await collection.deleteMany({})
    }
})


afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
})

global.signin = () => {
    // const email = 'test@gmail.com';
    // const password = '1234';

    // const response = await request(app)
    //     .post('/api/users/signup')
    //     .send({
    //         email, password
    //     })
    //     .expect(201)

    //     const cookie = response.get('Set-Cookie');
    //     return cookie;

    //BUILD JWT PAYLOAD {ID ,EMAIL}
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: 'abc@gmail.com'
    }

    //CREATE JWT
    const token = jwt.sign(payload, process.env.jwt!)

    //BULD SESSION OBJECT

    const session = { jwt: token }
    //TURN THAT SESSION TO JSON

    const sessionJSON = JSON.stringify(session);
    //TAKE JSON AND ENCODE TO BASE 64
    const base64 = Buffer.from(sessionJSON).toString('base64');

    
    //RETURN A STRING ENCODEDE DATA
    return [`session=${base64}`];
}

