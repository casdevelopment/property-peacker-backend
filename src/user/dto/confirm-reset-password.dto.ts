import { IsEmail, IsNumber, MinLength } from 'class-validator';

export class ConfirmResetPasswordDto {
    @IsEmail()
    email: string;

    @IsNumber()
    otp: number;

    @MinLength(6)
    password: string;
}
