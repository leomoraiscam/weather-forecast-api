import bcrypt from 'bcryptjs';
import * as fs from 'fs';
import request from 'supertest';

import { BeachPosition } from '@config/constants/beach-position-enum';
import { mongoHelper } from '@src/external/database/mongodb/helpers/mongo-helper';
import { UserRepository } from '@src/external/database/mongodb/implementations/user-repository';
import { app } from '@src/main/config/app';
import { AuthenticateUserUseCase } from '@src/modules/accounts/usecases/authenticate-user/authenticate-user-use-case';
import { createUser } from '@test/factories/user-factory';

let userRepository: UserRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let accessToken: string;

async function createSampleAuthenticateUser(): Promise<{
  accessToken: string;
}> {
  userRepository = new UserRepository();
  authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

  const parameters = {
    email: 'gon@hoklabew.ga',
    name: 'Chase Bowen',
    password: 'pass@1234',
  };

  const user = createUser({
    email: 'gon@hoklabew.ga',
    password: await bcrypt.hash(parameters.password, 8),
    isHashed: true,
  });

  await userRepository.create(user);

  const token = await authenticateUserUseCase.execute({
    email: parameters.email,
    password: parameters.password,
  });

  if (token.isRight()) {
    accessToken = token.value.token;
  }

  return {
    accessToken,
  };
}

describe('Forecast router', () => {
  beforeEach(async () => {
    await mongoHelper.clearCollection('beaches');
  });

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);

    await createSampleAuthenticateUser();
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
    fs.unlink(`${process.cwd()}/globalConfig.json`, () => {});
  });

  describe('Register beaches', () => {
    it('should be able to return status code 201 when request contains valid user data', async () => {
      await request(app)
        .post('/api/beaches')
        .set('x-access-token', accessToken)
        .send({
          name: 'Dee Why',
          lat: -33.750919,
          lng: 151.299059,
          position: BeachPosition.S,
        })
        .expect(201);
    });

    it('should be able to return status code 400 when request contains invalid user name', async () => {
      await request(app)
        .post('/api/beaches')
        .set('x-access-token', accessToken)
        .send({
          name: 'D',
          lat: -33.750919,
          lng: 151.299059,
          position: BeachPosition.S,
        })
        .expect(400);
    });

    it('should be able to return status code 400 when request contains invalid position', async () => {
      await request(app)
        .post('/api/beaches')
        .set('x-access-token', accessToken)
        .send({
          name: 'D',
          lat: -33.750919,
          lng: 151.299059,
          position: undefined,
        })
        .expect(400);
    });

    it('should be able to return status code 401 when request not contains userId', async () => {
      await request(app)
        .post('/api/beaches')
        .send({
          name: 'Dee Why',
          lat: -33.750919,
          lng: 151.299059,
          position: BeachPosition.S,
        })
        .expect(401);
    });

    it('should be able to return status code 409 when beach already exist', async () => {
      await request(app).post('/api/beaches').set('x-access-token', accessToken).send({
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      });

      await request(app)
        .post('/api/beaches')
        .set('x-access-token', accessToken)
        .send({
          name: 'Dee Why',
          lat: -33.750919,
          lng: 151.299059,
          position: BeachPosition.S,
        })
        .expect(409);
    });

    it.skip('should be able to return status code 500 on internal server error', async () => {
      const { accessToken: userToken } = await createSampleAuthenticateUser();

      await mongoHelper.disconnect();
      await mongoHelper.connect(`${process.env.MONGO_URL}wrong-text`);

      await request(app)
        .post('/api/beaches')
        .set('x-access-token', userToken)
        .send({
          name: 'Dee Why',
          lat: -33.750919,
          lng: 151.299059,
          position: BeachPosition.S,
        })
        .expect(500);
    });
  });

  describe('User beach forecast', () => {
    it('should be able to return status code 200 when request contains valid user data', async () => {
      const { accessToken: userBeachForecastToken } = await createSampleAuthenticateUser();

      await request(app).post('/api/beaches').set('x-access-token', userBeachForecastToken).send({
        name: 'Dee Why',
        lat: -33.750919,
        lng: 151.299059,
        position: BeachPosition.S,
      });

      await request(app)
        .get('/api/user-beach-forecast')
        .set('x-access-token', userBeachForecastToken)
        .expect(200);
    });

    it('should be able to return status code 401 when x-access-token not exist in headers', async () => {
      await request(app).get('/api/user-beach-forecast').expect(401);
    });
  });
});
