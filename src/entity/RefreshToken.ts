import Entity from './Entity';

/**
 *
 * @author Ilya Pikin
 */

export default interface RefreshToken extends Entity {
    userId: string;
    token: string;
}