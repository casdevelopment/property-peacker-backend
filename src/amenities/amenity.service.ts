import { Injectable, ForbiddenException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Amenity } from './entities/amenity.entity';
import { User } from '../user/entities/user.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class AmenityService {
    constructor(
        @InjectRepository(Amenity)
        private amenityRepo: Repository<Amenity>,

        @InjectRepository(User)
        private userRepo: Repository<User>,

        private permissionsService: PermissionsService,
    ) { }

    /**
     * Helper method to check if user is admin
     */
    private async isAdmin(userId: number): Promise<boolean> {
        const user = await this.userRepo.findOne({
            where: { id: userId, roleId: 2 },
        });
        return !!user;
    }

    /**
     * Helper method to get amenities permission for a user
     */
    private async getAmenitiesPermission(userId: number) {
        const permissions = await this.permissionsService.getPermissions(userId);

        // If permissions is an array
        if (Array.isArray(permissions)) {
            return permissions.find(p => p.route === '/amenities');
        }

        // If permissions is an object with routes property
        if (permissions && permissions.routes && Array.isArray(permissions.routes)) {
            return permissions.routes.find(p => p.route === '/amenities');
        }

        // If permissions is a single permission object
        return permissions;
    }

    /**
     * Helper method to check if user has permission (admin OR specific permission)
     */
    private async hasPermission(userId: number, action: 'canCreate' | 'canRead' | 'canUpdate' | 'canDelete'): Promise<boolean> {
        // Check if user is admin first
        const isAdminUser = await this.isAdmin(userId);
        if (isAdminUser) {
            return true; // Admin has all permissions
        }

        // Check specific permission
        const permission = await this.getAmenitiesPermission(userId);
        return permission?.[action] === true;
    }

    async create(dto: CreateAmenityDto, userId: number) {
        // Check if user is admin OR has create permission
        const canCreate = await this.hasPermission(userId, 'canCreate');

        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create amenities');
        }

        const existing = await this.amenityRepo.findOne({ where: { amenity: dto.amenity } });
        if (existing) throw new ConflictException('Amenity already exists');

        const amenity = this.amenityRepo.create({
            amenity: dto.amenity,
            addedById: userId,
        });

        const saved = await this.amenityRepo.save(amenity);
        return { success: true, message: 'Amenity created successfully', data: saved };
    }

    async findAll(userId?: number) {
        // Check read permission if user is authenticated
        if (userId) {
            const canRead = await this.hasPermission(userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view amenities');
            }
        }

        const amenities = await this.amenityRepo.find({ order: { createdAt: 'DESC' } });
        return { success: true, message: 'Amenities fetched successfully', data: amenities };
    }

    async update(id: number, dto: UpdateAmenityDto, userId: number) {
        // Check if user is admin OR has update permission
        const canUpdate = await this.hasPermission(userId, 'canUpdate');

        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update amenities');
        }

        const amenity = await this.amenityRepo.findOne({ where: { id } });
        if (!amenity) throw new NotFoundException('Amenity not found');

        Object.assign(amenity, dto);
        const updated = await this.amenityRepo.save(amenity);
        return { success: true, message: 'Amenity updated successfully', data: updated };
    }

    async remove(id: number, userId: number) {
        // Check if user is admin OR has delete permission
        const canDelete = await this.hasPermission(userId, 'canDelete');

        if (!canDelete) {
            throw new ForbiddenException('You do not have permission to delete amenities');
        }

        const amenity = await this.amenityRepo.findOne({ where: { id } });
        if (!amenity) throw new NotFoundException('Amenity not found');

        await this.amenityRepo.remove(amenity);
        return { success: true, message: 'Amenity deleted successfully' };
    }
}