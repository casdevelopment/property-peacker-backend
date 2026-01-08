import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { User } from '../user/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Permission, User])],
    providers: [PermissionsService],
    controllers: [PermissionsController],
    exports: [PermissionsService], // export for UserService
})
export class PermissionsModule { }
