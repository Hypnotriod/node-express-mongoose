
/**
 *
 * @author Ilya Pikin
 */

export default interface ServerApplicationConfig {
    production: boolean;
    serverPort: number;
    dbHost: string;
    dbPort: number;
    dbName: string;
    dbUserName: string;
    dbUserPassword: string;
}