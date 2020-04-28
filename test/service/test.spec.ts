import authTests from './UserAuthServiceTest';
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
