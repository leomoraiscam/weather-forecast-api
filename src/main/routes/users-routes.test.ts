import * as fs from 'fs';
import request from 'supertest';

import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import app from '@src/main/config/app';

describe.only('Users Router', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
    // await mongoHelper.clearCollection('users');
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
    fs.unlink(`${process.cwd()}/globalConfig.json`, () => {});
  });

  beforeEach(async () => {
    // await mongoHelper.clearCollection('users');
  });

  it('should return status code 201 when request contains valid user data', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Roy Figueroa',
        email: 'seej@fu.cm',
        password: 'pass@123',
      })
      .expect(201);
  });

  it('should return status code 400 when request contains invalid user name', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'A',
        email: 'seej@fu.cm',
        password: 'pass@123',
      })
      .expect(400);
  });

  it('should return status code 400 when request contains invalid user email', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Cornelia Pena',
        email: 'wrongEmail.com',
        password: 'pass@123',
      })
      .expect(400);
  });

  it('should return status code 400 when request is missing user name', async () => {
    await request(app)
      .post('/api/users')
      .send({
        email: 'mo@ebe.cf',
        password: 'pass@123',
      })
      .expect(400);
  });

  it('should return status code 400 when request is missing user email', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Cornelia Pena',
        password: 'pass@123',
      })
      .expect(400);
  });

  it('should return status code 400 when request is missing user password', async () => {
    await request(app)
      .post('/api/users')
      .send({
        name: 'Cornelia Pena',
        email: 'mo@ebe.cf',
      })
      .expect(400);
  });

  it('should return status code 400 when request is missing user name, email and password', async () => {
    await request(app).post('/api/users').send({}).expect(400);
  });

  it('should return status code 409 when user already exist', async () => {
    await request(app).post('/api/users').send({
      name: 'Cornelia Pena',
      email: 'mo@ebe.cf',
      password: 'pass@123',
    });

    await request(app)
      .post('/api/users')
      .send({
        name: 'Cornelia Pena',
        email: 'mo@ebe.cf',
        password: 'pass@123',
      })
      .expect(409);
  });

  it('should return status code 500 on internal server error', async () => {
    await mongoHelper.disconnect();
    await mongoHelper.connect(`${process.env.MONGO_URL}/wrong-text`);

    await request(app)
      .post('/api/users')
      .send({
        name: 'Cornelia Pena',
        email: 'mo@ebe.cf',
        password: 'pass@123',
      })
      .expect(500);
  });
});
