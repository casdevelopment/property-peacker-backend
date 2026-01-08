import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { User } from '../user/entities/user.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category, User]),
        PermissionsModule,
    ],
    controllers: [CategoryController],
    providers: [CategoryService],
})
export class CategoryModule { }
