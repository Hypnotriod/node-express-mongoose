import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { container, injectable, singleton, inject } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import mongoose from 'mongoose';
import http from 'http';
import ServerApplicationConfig from './ServerApplicationConfig';
import FaviconController from '../controller/FaviconController';
import GetAllProductsController from '../controller/GetAllProductsController';
import AddNewProductController from '../controller/AddNewProductController';
import AddNewDiscountController from '../controller/AddNewDiscountController';
import GetAllDiscountsController from '../controller/GetAllDiscountsController';
import AddNewUserController from '../controller/AddNewUserController';
import LoginController from '../controller/LoginController';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ServerApplication extends Server {

    constructor(@inject('ServerApplicationConfig') private readonly config: ServerApplicationConfig) {
        super(!config.production);
    }

    public async launch(): Promise<void> {
        this.initializeRouterHandles();
        await this.establishDBConnection();
        this.initControllers();
        this.startServer();
    }

    private initializeRouterHandles(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private async establishDBConnection(): Promise<void> {
        try {
            await mongoose.connect(
                this.config.dbUri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (err) {
            Logger.Err('Unable to connect to the database.');
            Logger.Err(err, true);
            throw err;
        }
    }

    private initControllers(): void {
        super.addControllers([
            container.resolve(FaviconController),
            container.resolve(GetAllProductsController),
            container.resolve(GetAllDiscountsController),
            container.resolve(AddNewProductController),
            container.resolve(AddNewDiscountController),
            container.resolve(AddNewUserController),
            container.resolve(LoginController),
        ]);
    }

    private startServer(): void {
        http.createServer(this.app).listen(this.config.serverPort);
    }
}
