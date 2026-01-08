import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity('statuses')
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    status: string;

    // 👤 Admin user id who added this status
    @Column()
    addedBy: number;

    @CreateDateColumn()
    createdAt: Date;
}
