import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { container, injectable, singleton, inject } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import mongoose from 'mongoose';
import http from 'http';
import processCorsHeaders from '../controller/middleware/CorsMiddleware';
import ServerApplicationConfig from './ServerApplicationConfig';
import FaviconController from '../controller/FaviconController';
import ProductsController from '../controller/ProductsController';
import DiscountsController from '../controller/DiscountsController';
import UserController from '../controller/UserController';
import UserAuthController from '../controller/UserAuthController';
import NotFoundController from '../controller/NotFoundController';

/**
 *
 * @author Ilya Pikin
 */

@injectable()
@singleton()
export default class ServerApplication extends Server {

    private server: http.Server;

    constructor(private readonly config: ServerApplicationConfig) {
        super(!config.production);
    }

    public async launch(): Promise<ServerApplication> {
        this.initializeLogger();
        this.initializeRouterHandles();
        await this.establishDBConnection();
        this.initControllers();
        this.startServer();

        return this;
    }

    public async launchTest(establishDBConnection: boolean = true, startServer: boolean = false): Promise<ServerApplication> {
        this.initializeLogger();
        this.initializeRouterHandles();
        if (establishDBConnection) {
            await this.establishDBConnection();
        }
        this.initControllers();
        if (startServer) {
            this.startServer();
        }

        return this;
    }

    public async terminate(): Promise<void> {
        try {
            await mongoose.connection.close();
        } catch (err) {
            Logger.Err(err);
        }

        try {
            if (this.server) { this.server.close(); }
        } catch (err) {
            Logger.Err(err);
        }
    }

    private initializeLogger(): void {
        Logger.mode = this.config.loggerMode;
        if (this.config.loggerFilePath) {
            Logger.filePath = this.config.loggerFilePath;
        }
    }

    private initializeRouterHandles(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(processCorsHeaders);
    }

    private async establishDBConnection(): Promise<void> {
        try {
            await mongoose.connect(
                this.config.dbUri, {
                useCreateIndex: true,
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
            container.resolve(ProductsController),
            container.resolve(DiscountsController),
            container.resolve(UserController),
            container.resolve(UserAuthController),
            container.resolve(NotFoundController),
        ]);
    }

    private startServer(): void {
        try {
            this.server = http.createServer(this.app).listen(this.config.serverPort);
        } catch (err) {
            Logger.Err('Unable to create server.');
            Logger.Err(err);
            throw err;
        }
    }
}
