import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmenityService } from './amenity.service';
import { AmenityController } from './amenity.controller';
import { Amenity } from './entities/amenity.entity';
import { User } from '../user/entities/user.entity';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Amenity, User]),
        PermissionsModule,
    ],
    providers: [AmenityService],
    controllers: [AmenityController],
})
export class AmenityModule { }
