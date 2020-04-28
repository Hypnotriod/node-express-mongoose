import authTests from './UserAuthServiceTest';
import UserAuthService from '../../src/service/UserAuthService';
import UserAuthTestEnvironment from './UserAuthTestEnvironment';

const userAuthTestEnvironment: UserAuthTestEnvironment = new UserAuthTestEnvironment();

beforeAll(async done => {
    await userAuthTestEnvironment.setup();
    done();
});

afterAll(async done => {
    await userAuthTestEnvironment.terminate();
    done();
});

describe('User authorization & authentication', authTests);
