import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp, OtpType } from './entities/otp.entity';

@Injectable()
export class OtpService {
    constructor(
        @InjectRepository(Otp)
        private otpRepository: Repository<Otp>,
    ) { }

    async generateOtp(
        user: User,
        manager?: EntityManager,
        type: OtpType = OtpType.REGISTER
    ): Promise<Otp> {
        const repo = manager ? manager.getRepository(Otp) : this.otpRepository;

        const code = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const otp = repo.create({
            user,
            userId: user.id,
            code,
            expiresAt,
            type,
        });

        return repo.save(otp);
    }


    // Verify OTP
    async verifyOtp(
        userId: number,
        code: number,
        type: OtpType = OtpType.REGISTER
    ): Promise<boolean> {
        const queryRunner = this.otpRepository.manager.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // ✅ Find the latest OTP for this user
            const otp = await queryRunner.manager.findOne(Otp, {
                where: { userId, code, type },
                order: { createdAt: 'DESC' },
            });

            if (!otp || otp.expiresAt < new Date()) {
                await queryRunner.rollbackTransaction();
                return false; // invalid or expired OTP
            }

            // ✅ Update the user as verified
            await queryRunner.manager.update(User, { id: userId }, { isVerified: true });

            // ✅ Delete OTP after successful verification
            await queryRunner.manager.delete(Otp, otp.id);

            await queryRunner.commitTransaction();
            return true;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }




    // Optional: remove expired OTPs
    async removeExpiredOtps() {
        await this.otpRepository
            .createQueryBuilder()
            .delete()
            .from(Otp)
            .where('expiresAt < :now', { now: new Date() })
            .execute();
    }
}
