import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Amenity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    amenity: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'addedBy' })
    addedBy: User;

    @Column({ nullable: true })
    addedById: number;

    @CreateDateColumn()
    createdAt: Date;
}
