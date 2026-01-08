import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

import { Blog } from './entities/blog.entity';
import { BlogController } from './blog.controller';
import { BlogService } from './blog.service';
import { User } from '../user/entities/user.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Blog, User]),
        PermissionsModule,
        MulterModule.register({
            storage: diskStorage({
                destination: './uploads/blogs',
                filename: (_req, file, cb) => {
                    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, unique + extname(file.originalname));
                },
            }),
        }),
    ],
    controllers: [BlogController],
    providers: [BlogService],
})
export class BlogModule { }
