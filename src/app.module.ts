import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { PropertyListingModule } from './property-listing/property-listing.module';
import { RolesModule } from './roles/roles.module';

import { User } from './user/entities/user.entity';
import { Otp } from './user/entities/otp.entity';
import { PropertyListing } from './property-listing/entities/property-listing.entity';
import { Role } from './roles/role.entity';
import { RolesService } from './roles/roles.service';
import { LocationModule } from './location/location.module';
import { StatusModule } from './status/status.module';
import { CategoryModule } from './category/category.module';
import { AmenityModule } from './amenities/amenity.module';
import { BlogModule } from './blog/blog.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'nest_auth_db',
      autoLoadEntities: true,
      entities: [User, Otp, PropertyListing, Role], // <-- add Role here
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    MailModule,
    UserModule,
    AuthModule,
    RolesModule,               // <-- must import RolesModule
    PropertyListingModule,
    CategoryModule,
    BlogModule,
    PermissionsModule,
    AmenityModule,
    LocationModule,
    StatusModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly rolesService: RolesService) { }

  async onApplicationBootstrap() {
    await this.rolesService.seedRoles(); // <-- now RolesService will be injectable
  }
}
