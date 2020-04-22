import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { container } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import mongoose from 'mongoose';
import http from 'http';
import ServerApplicationConfig from './ServerApplicationConfig';
import FaviconController from '../controller/FaviconController';
import GetAllProductsController from '../controller/GetAllProductsController';
import AddNewProductController from '../controller/AddNewProductController';
import AddNewDiscountController from '../controller/AddNewDiscountController';
import GetAllDiscountsController from '../controller/GetAllDiscountsController';

/**
 *
 * @author Ilya Pikin
 */

export default class ServerApplication extends Server {

    constructor(config: ServerApplicationConfig) {
        super(config.production === false);
        this.launch(config);
    }

    private async launch(config: ServerApplicationConfig): Promise<void> {
        this.initializeRouterHandles();
        await this.establishDBConnection(config);
        this.initControllers();
        this.startServer(config);
    }

    private initializeRouterHandles(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private async establishDBConnection(config: ServerApplicationConfig): Promise<void> {
        try {
            await mongoose.connect(
                config.dbUri,
                {
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
        ]);
    }

    private startServer(config: ServerApplicationConfig): void {
        http.createServer(this.app).listen(config.serverPort);
    }
}
