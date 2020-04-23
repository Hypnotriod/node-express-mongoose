import { singleton } from 'tsyringe';
import Repository from './Repository';
import User from '../entity/User';
import UserModel from '../model/UserModel';

/**
 *
 * @author Ilya Pikin
 */

@singleton()
export default class UserRepository extends Repository<User> {
    constructor() {
        super(UserModel);
    }
}