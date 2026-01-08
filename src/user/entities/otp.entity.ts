import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum OtpType {
    REGISTER = 'register',
    RESET_PASSWORD = 'reset_password',
}


@Entity()
export class Otp {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    code: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ type: 'enum', enum: OtpType, default: OtpType.REGISTER })
    type: OtpType;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}
