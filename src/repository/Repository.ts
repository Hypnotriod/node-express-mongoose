import { Model, Document } from 'mongoose';
import { Logger } from '@overnightjs/logger';

/**
 *
 * @author Ilya Pikin
 */

export default class Repository<T extends Document> {
    constructor(protected readonly model: Model<T>) { }

    public async validate(data: T | any): Promise<boolean> {
        const entity: T = new this.model(data);
        try {
            await entity.validate();
        } catch (err) {
            Logger.Info(`Validation fail for ${this.model.modelName}: ${JSON.stringify(data)}`);
            Logger.Info(err);
            return false;
        }
        return true;
    }

    public async save(data: T | any): Promise<T | null> {
        const entity: T = new this.model(data);
        try {
            return await entity.save();
        } catch (err) {
            Logger.Err(`Unable to save ${this.model.modelName}: ${JSON.stringify(data)}`);
            Logger.Err(err);
        }
        return null;
    }

    public async saveAll(datas: T[] | any[]): Promise<T[]> {
        const result: T[] = [];
        for (let data of datas) {
            const entity: T | null = await this.save(data);
            if (entity) {
                result.push(entity);
            }
        }
        return result;
    }

    public async findOne(filter: object): Promise<T | null> {
        return this.model.findOne(filter);
    }

    public async find(filter: object): Promise<T[]> {
        return this.model.find(filter);
    }

    public async findAll(): Promise<T[]> {
        return this.model.find();
    }

    public async findAllLimit(limit: number): Promise<T[]> {
        return this.model.find().limit(limit);
    }

    public async findById(id: string): Promise<T | null> {
        try {
            return await this.model.findById(id);
        } catch (err) {
            Logger.Err(`Unable to find ${this.model.modelName} by id: ${id}`);
            Logger.Err(err);
        }
        return null;
    }

    public async deleteById(id: string): Promise<T | null> {
        try {
            return await this.model.findByIdAndDelete(id);
        } catch (err) {
            Logger.Err(`Unable to delete ${this.model.modelName} by id: ${id}`);
            Logger.Err(err);
        }
        return null;
    }

    public async delete(entity: T): Promise<T | null> {
        try {
            return await entity.remove();
        } catch (err) {
            Logger.Err(`Unable to delete ${this.model.modelName}`);
            Logger.Err(err);
        }
        return null;
    }

    public async deleteMany(filter: object): Promise<{ deletedCount?: number } | null> {
        try {
            return await this.model.deleteMany(filter);
        } catch (err) {
            Logger.Err(`Unable to delete ${this.model.modelName}`);
            Logger.Err(err);
        }
        return null;
    }
}