import {DataFactory, Seeder} from 'nestjs-seeder';
import {Model} from 'mongoose';
import {Property, PropertyDocument} from '../modules/properties/property.schema';
import {Inject} from '@nestjs/common';
import {ModelEnum} from '../enums/model.enum';

export class PropertySeeder implements Seeder {
  constructor(@Inject(ModelEnum.Properties) private readonly dataModel: Model<PropertyDocument>) {}

  drop(): Promise<any> {
    return this.dataModel.deleteMany({}) as any;
  }

  seed(): Promise<any> {
    const data = DataFactory.createForClass(Property).generate(50);
    return this.dataModel.insertMany(data);
  }
}
