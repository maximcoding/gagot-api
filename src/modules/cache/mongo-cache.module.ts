import {CACHE_MANAGER, CacheModule, Inject, Logger, Module, OnModuleInit} from '@nestjs/common';
import {Cache} from 'cache-manager';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {CacheService} from './cache.service';
import * as mongoStore from 'cache-manager-mongoose';
import * as mongoose from 'mongoose';
import {ModelEnum} from '../../enums/model.enum';

// const schema = new mongoose.Schema(
//   { _id: String, val: mongoose.Schema.Types.Mixed, exp: Date },
//   { collection: 'cacheManager', versionKey: false }
// );
// schema.index({ exp: 1 }, { expireAfterSeconds: 0 });
// schema.index({ foo: 1 });
// const model = mongoose.model('Cache', schema);

@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: mongoStore,
        connection: mongoose.createConnection(process.env.MONGO_DB_URI),
        mongoose: mongoose,
        modelName: ModelEnum.Cache,
        modelOptions: {
          collection: 'cache',
          versionKey: false, // do not create __v field
        },
      }),
    }),
  ],
  providers: [CacheService],
  exports: [MongoCacheModule, CacheService],
})
export class MongoCacheModule implements OnModuleInit {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public onModuleInit(): any {
    const logger = new Logger('Cache');
  }
}
