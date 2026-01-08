import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Blog {
    @PrimaryGeneratedColumn()
    id: number;

    // single image path
    @Column({ type: 'jsonb' })
    description: {
        heading: string;
        text: string;
    }[];

    @Column()
    image: string;

    @Column()
    addedById: number;

    @CreateDateColumn()
    createdAt: Date;
}
