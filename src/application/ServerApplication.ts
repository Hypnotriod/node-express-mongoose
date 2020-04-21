import * as bodyParser from 'body-parser';
import { Server } from '@overnightjs/core';
import { container } from 'tsyringe';
import { Logger } from '@overnightjs/logger';
import http from 'http';
import ServerApplicationConfig from './ServerApplicationConfig';
import FaviconController from '../controller/FaviconController';

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
        this.initializeDatabase(config);
        this.initializeModels();
        await this.establishDBConnection();
        this.initControllers();
        this.startServer(config);
    }

    private initializeRouterHandles(): void {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
    }

    private initializeDatabase(config: ServerApplicationConfig): void {
        // todo
    }

    private initializeModels(): void {
        // todo
    }

    private async establishDBConnection(): Promise<void> {
        // todo
    }

    private initControllers(): void {
        super.addControllers([
            container.resolve(FaviconController),
        ]);
    }

    private startServer(config: ServerApplicationConfig): void {
        http.createServer(this.app).listen(config.serverPort);
    }
}
