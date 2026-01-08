import { User } from './../user/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Status, User]),
        PermissionsModule,
    ],
    controllers: [StatusController],
    providers: [StatusService],
})
export class StatusModule { }
