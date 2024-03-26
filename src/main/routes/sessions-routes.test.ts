import * as fs from 'fs';
import request from 'supertest';

import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { app } from '@src/main/config/app';

describe('Sessions router', () => {
  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
    fs.unlink(`${process.cwd()}/globalConfig.json`, () => {});
  });

  it('should be able to return status code 200 when request contains valid user data', async () => {
    await request(app).post('/api/users').send({
      name: 'Calvin Carson',
      email: 'izoac@om.rs',
      password: 'pass@123',
    });

    await request(app)
      .post('/api/sessions')
      .send({
        email: 'izoac@om.rs',
        password: 'pass@123',
      })
      .expect(200);
  });

  it('should be able to return status code 401 when user a non exist and receive data the same', async () => {
    await request(app)
      .post('/api/sessions')
      .send({
        email: 'bojal@gezzisgi.bg',
        password: 'pass@123',
      })
      .expect(401);
  });

  it('should be able to return status code 401 when request contains invalid user email', async () => {
    await request(app).post('/api/users').send({
      name: 'Walter Jacobs',
      email: 'low@lokafe.cz',
      password: 'pass@123',
    });

    await request(app)
      .post('/api/sessions')
      .send({
        email: 'wrong@email.com',
        password: 'pass@123',
      })
      .expect(401);
  });

  it('should be able to return status code 401 when request contains invalid user password', async () => {
    await request(app).post('/api/users').send({
      name: 'Walter Jacobs',
      email: 'low@lokafe.cz',
      password: 'pass@123',
    });

    await request(app)
      .post('/api/sessions')
      .send({
        email: 'low@lokafe.cz',
        password: 'pass@456',
      })
      .expect(401);
  });

  it('should be able to return status code 500 on internal server error', async () => {
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
