
import { USER_LOGIN_ADMIN, USER_PASS_ADMIN } from './constants/Constants';
import { container } from 'tsyringe';
import { UserRole } from '../src/entity/User';
import UserModel from '../src/model/UserModel';
import PasswordService from '../src/service/PasswordService';

/**
 *
 * @author Ilya Pikin
 */

export default async function setupDatabase(): Promise<void> {
    const passwordService: PasswordService = container.resolve(PasswordService);

    await UserModel.remove({});
    await new UserModel({
        login: USER_LOGIN_ADMIN,
        password: await passwordService.hash(USER_PASS_ADMIN),
        role: UserRole.ADMIN,
        isActive: true
    }).save();
}
