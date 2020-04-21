import { Model, Document } from 'mongoose';
import { Logger } from '@overnightjs/logger';

export default class Repository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    public async save(data: any): Promise<T | null> {
        const entity: T = new this.model(data);
        try {
            await entity.validate();
            return entity.save();
        } catch (err) {
            Logger.Err(`Unable to save ${entity.modelName} with data: ${JSON.stringify(data)}`);
            Logger.Err(err);
        }
        return null;
    }

    public async getAll(): Promise<T[]> {
        return this.model.find();
    }

    public async getAllLimit(limit: number): Promise<T[]> {
        return this.model.find().limit(limit);
    }
}