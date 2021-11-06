import {seeder} from 'nestjs-seeder';
import {PropertiesSeeder} from './seeders/properties.seeder';
import {MongooseModule} from '@nestjs/mongoose';
import {Property, PropertySchema} from './modules/properties/propertySchema';
import {UsersSeeder} from './seeders/users.seeder';
import {CategoriesSeeder} from './seeders/categories.seeder';
import {Category, CategorySchema} from './modules/categories/category.schema';
import {User, UserSchema} from './modules/users/schemas/user.schema';

seeder({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://maxim:maxim1214@cluster0.cauco.mongodb.net/gagotdb?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      {name: User.name, schema: UserSchema},
      {name: Category.name, schema: CategorySchema},
      {name: Property.name, schema: PropertySchema},
    ]),
  ],
}).run([UsersSeeder, CategoriesSeeder, PropertiesSeeder]);
