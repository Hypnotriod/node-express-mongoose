import authTests from './UserAuthServiceTest';
import ServicesTestEnvironment from './ServicesTestEnvironment';

/**
 *
 * @author Ilya Pikin
 */

const servicesTestEnvironment: ServicesTestEnvironment = new ServicesTestEnvironment();

beforeAll(async done => {
    await servicesTestEnvironment.setup();
    done();
});

afterAll(async done => {
    await servicesTestEnvironment.terminate();
    done();
});

describe('User authorization & authentication', authTests);
