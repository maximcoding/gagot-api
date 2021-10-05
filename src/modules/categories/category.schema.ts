import {CategoryEnum} from '../../enums/categoryEnum';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';
import {CommonSchemaOptions} from '../../helpers/common-schema.options';

export interface ICategory {
  _id?: string;
  name: CategoryEnum;
  photoUrl: string;
}

@Schema(CommonSchemaOptions)
export class Category implements ICategory {
  @Prop({
    type: String,
    required: true,
    enum: Object.values(CategoryEnum),
    unique: true,
  })
  name: CategoryEnum;

  @Prop({type: String, required: true})
  photoUrl: string;
}

export type CategoryDocument = Category & Document;

export const CategorySchema = SchemaFactory.createForClass(Category);
