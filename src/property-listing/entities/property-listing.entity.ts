import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('property_listing')
export class PropertyListing {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'varchar', length: 100 })
    category: string;

    @Column({ type: 'varchar', length: 50 })
    status: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    yearlyTax: number;

    @Column({ type: 'json' })
    images: string[];

    @Column({ type: 'varchar', length: 255 })
    streetAddress: string;

    @Column({ type: 'varchar', length: 100 })
    country: string;

    @Column({ type: 'varchar', length: 100 })
    state: string;

    @Column({ type: 'varchar', length: 100 })
    city: string;

    @Column({ type: 'varchar', length: 20 })
    zipcode: string;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    size: number;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    plotSize: number;

    @Column({ type: 'int' })
    rooms: number;

    @Column({ type: 'int' })
    bathrooms: number;

    @Column({ type: 'int' })
    floors: number;

    @Column({ type: 'int' })
    garages: number;

    @Column({ type: 'int' })
    builtYear: number;

    @Column({ type: 'varchar', length: 100 })
    structureType: string;

    @Column({ type: 'text', nullable: true })
    extraDetails?: string;

    @Column({ type: 'boolean', default: false })
    existingMember: boolean;

    @Column({ type: 'json', nullable: true })
    amenities?: string[];

    // ✅ FK COLUMN (THIS IS THE KEY PART)
    @Column({ type: 'int' })
    addedById: number;

    // ✅ RELATION
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'addedById' })
    addedBy: User;

    @Column({ type: 'boolean', default: false })
    isApproved: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
