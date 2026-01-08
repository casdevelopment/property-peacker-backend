import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyListingService } from './property-listing.service';
import { PropertyListingController } from './property-listing.controller';
import { PropertyListing } from './entities/property-listing.entity';
import { User } from '../user/entities/user.entity';
import { RolesModule } from 'src/roles/roles.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PropertyListing, User]),
        RolesModule,
        PermissionsModule,
    ],
    controllers: [PropertyListingController],
    providers: [PropertyListingService],
})
export class PropertyListingModule { }
