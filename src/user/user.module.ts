import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { MailModule } from '../mail/mail.module'; // ✅ import MailModule
import { JwtModule } from '@nestjs/jwt';
import { Otp } from './entities/otp.entity';
import { OtpService } from './otp.service';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Otp]),
    MailModule,
    PermissionsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, OtpService],
  exports: [UserService],
})
export class UserModule { }
