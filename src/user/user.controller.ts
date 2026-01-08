
import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OtpService } from './otp.service'

@Controller('auth/users')
export class UserController {

  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
  ) { }

  @Post("sign-up")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('sign-in')
  async signIn(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.userService.signIn(email, password);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: number) {
    console.log('Route hit!', id); // check server logs
    return this.userService.findOne(id);
  }
  @Post('verify-otp')
  async verifyOtpEndpoint(@Body() body: { userId: number; otp: number }) {
    const { userId, otp } = body;
    const isValid = await this.userService.verifyRegisterOtp(userId, otp);

    if (!isValid) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    return { success: true, message: 'User verified successfully' };
  }
  @Post('request-reset-password')
  async requestResetPassword(@Body('email') email: string) {
    return this.userService.requestPasswordReset(email);
  }

  @Post('confirm-reset-password')
  async confirmResetPassword(
    @Body() body: { email: string; otp: number; password: string },
  ) {
    const { email, otp, password } = body;
    return this.userService.resetPassword(email, otp, password);
  }


  @Post('reRequestOtp')
  async ReRequestOtp(
    @Body() email: string
  ) {
    return this.userService.reRequestOtp(email);
  }

}
