import { singleton, injectable } from 'tsyringe';
import UserRepository from '../repository/UserRepository';
import User from '../entity/User';
import PasswordValidationService from './PasswordValidationService';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class UserService {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly passwordValidationService: PasswordValidationService) { }

    public async save(data: any | User): Promise<User | null> {
        if (!this.passwordValidationService.validate(data.password)) {
            return null; // todo Error handling
        }
        return this.userRepository.save(data);
    }

    public async findAll(): Promise<User[]> {
        return this.userRepository.findAll();
    }
}