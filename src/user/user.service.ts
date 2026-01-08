import {
  Injectable,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { Otp, OtpType } from './entities/otp.entity';
import { otpTemplate } from 'src/mail/template/otp.template';
import { PermissionsService } from 'src/permissions/permissions.service';
import { Permission } from 'src/permissions/entities/permission.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,

    private readonly mailService: MailService,
    private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionsService,
  ) { }

  // ===============================
  // 1️⃣ CREATE USER + SEND OTP
  // ===============================
  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Check if user already exists
      const existingUser = await queryRunner.manager.findOne(User, {
        where: { email: createUserDto.email },
      });
      if (existingUser) throw new ConflictException('User already exists');

      // 2️⃣ Hash password
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // 3️⃣ Create user entity
      const user = queryRunner.manager.create(User, {
        ...createUserDto,
        password: hashedPassword,
        roleId: 1,
        isVerified: false,
      });

      // 4️⃣ Save user
      const savedUser = await queryRunner.manager.save(user);

      // 5️⃣ Generate OTP inside transaction
      const otp = await this.generateOtp(savedUser, OtpType.REGISTER, queryRunner.manager);

      // 6️⃣ Send OTP email (outside DB transaction)
      await this.mailService.sendMail(
        savedUser.email,
        'Your OTP Code 🔐',
        otpTemplate(otp.code, otp.expiresAt),
      );

      // 7️⃣ Create default permissions inside transaction
      const routes = [
        { route: '/blogs', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
        { route: '/comments', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
        { route: '/categories', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
        { route: '/status', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
        { route: '/amenities', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
      ];

      const permission = queryRunner.manager.create(Permission, {
        userId: savedUser.id,
        routes,
      });
      await queryRunner.manager.save(permission);

      // 8️⃣ Commit transaction
      await queryRunner.commitTransaction();

      return savedUser;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }


  // ===============================
  // 2️⃣ SIGN-IN
  // ===============================
  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    if (!user.isVerified) throw new UnauthorizedException("Verify otp first")
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET || 'secretKey',
        expiresIn: process.env.JWT_EXPIRES_IN,
      }),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    };
  }

  // ===============================
  // 3️⃣ GET USER(S)
  // ===============================
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'email', 'fullName', 'phone', 'createdAt', 'updatedAt'],
    });
  }

  // ===============================
  // 4️⃣ OTP FUNCTIONS
  // ===============================
  private async generateOtp(user: User, type: OtpType, manager = this.otpRepository.manager): Promise<Otp> {
    const code = Math.floor(100000 + Math.random() * 900000); // 6-digit
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    const otp = manager.create(Otp, { user, userId: user.id, code, type, expiresAt });
    return manager.save(otp);
  }

  private async verifyOtp(userId: number, code: number, type: OtpType): Promise<Otp> {
    const otp = await this.otpRepository.findOne({
      where: { userId, code, type },
      order: { createdAt: 'DESC' },
    });

    if (!otp || otp.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    // Delete OTP after verification
    await this.otpRepository.delete(otp.id);
    return otp;
  }

  // ===============================
  // 5️⃣ VERIFY REGISTER OTP
  // ===============================
  async verifyRegisterOtp(userId: number, code: number): Promise<boolean> {
    const otp = await this.verifyOtp(userId, code, OtpType.REGISTER);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    user.isVerified = true;
    await this.userRepository.save(user);

    return true;
  }

  // ===============================
  // 6️⃣ PASSWORD RESET FLOW
  // ===============================
  async requestPasswordReset(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const otp = await this.generateOtp(user, OtpType.RESET_PASSWORD);

    await this.mailService.sendMail(
      user.email,
      'Reset Your Password 🔑',
      `Your OTP is ${otp.code}. It expires at ${otp.expiresAt.toLocaleTimeString()}`,
    );

    return { success: true, message: 'OTP sent to your email' };
  }

  async resetPassword(email: string, otpCode: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    await this.verifyOtp(user.id, otpCode, OtpType.RESET_PASSWORD);

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    return { success: true, message: 'Password reset successfully' };
  }
  async reRequestOtp(email: string): Promise<void> {
    const queryRunner = this.userRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Find the user by email
      // countinue from here
      return
      const user = await queryRunner.manager.findOne(User, { where: { email } });
      if (!user) throw new NotFoundException('User not found');

      // 2️⃣ Delete existing OTPs for this user
      await queryRunner.manager.delete(Otp, { userId: user.id });

      // 3️⃣ Generate new OTP inside transaction
      const otp = await this.generateOtp(user, OtpType.REGISTER, queryRunner.manager);

      // 4️⃣ Commit the transaction
      await queryRunner.commitTransaction();

      // 5️⃣ Send OTP email (outside DB transaction)
      await this.mailService.sendMail(
        user.email,
        'Your OTP Code 🔐',
        otpTemplate(otp.code, otp.expiresAt)
      );

    } catch (err) {
      await queryRunner.rollbackTransaction();

      // 6️⃣ Handle exceptions
      if (err instanceof NotFoundException) throw err;
      throw new InternalServerErrorException('Failed to re-request OTP');
    } finally {
      await queryRunner.release();
    }
  }

}
