import {seeder} from 'nestjs-seeder';
import {PropertySeeder} from './property.seeder';
import {MongooseModule} from '@nestjs/mongoose';
import {ModelEnum} from '../enums/model.enum';
import {PropertySchema} from '../modules/properties/property.schema';

seeder({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
    MongooseModule.forFeature([{name: ModelEnum.Properties, schema: PropertySchema}]),
  ],
}).run([PropertySeeder]);
