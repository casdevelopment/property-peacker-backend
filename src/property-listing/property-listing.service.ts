import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PropertyListing } from './entities/property-listing.entity';
import { CreatePropertyListingDto } from './dto/create-property-listing.dto';
import { UpdatePropertyListingDto } from './dto/update-property-listing.dto';
import { User } from '../user/entities/user.entity';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class PropertyListingService {
    constructor(
        @InjectRepository(PropertyListing)
        private propertyRepository: Repository<PropertyListing>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private permissionsService: PermissionsService
    ) { }

    /**
     * Helper method to check if user is admin
     */
    private async isAdmin(userId: number): Promise<boolean> {
        const user = await this.userRepository.findOne({
            where: { id: userId, roleId: 2 },
        });
        return !!user;
    }

    /**
     * Helper method to check if user owns the property
     */
    private async isPropertyOwner(propertyId: number, userId: number): Promise<boolean> {
        const property = await this.propertyRepository.findOne({
            where: { id: propertyId, addedBy: { id: userId } },
        });
        return !!property;
    }

    /**
     * Helper method to get listproperty permission for a user
     */
    private async getListPropertyPermission(userId: number) {
        const permissions = await this.permissionsService.getPermissions(userId);

        // If permissions is an array
        if (Array.isArray(permissions)) {
            return permissions.find(p => p.route === '/listproperty');
        }

        // If permissions is an object with routes property
        if (permissions && permissions.routes && Array.isArray(permissions.routes)) {
            return permissions.routes.find(p => p.route === '/listproperty');
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
        const permission = await this.getListPropertyPermission(userId);
        return permission?.[action] === true;
    }

    async create(
        dto: CreatePropertyListingDto,
        authUser: { userId: number; email: string },
    ): Promise<PropertyListing> {
        // Check if user is admin OR has create permission
        const canCreate = await this.hasPermission(authUser.userId, 'canCreate');

        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create property listings');
        }

        try {
            const property = this.propertyRepository.create({
                ...dto,
                addedById: authUser.userId,
            });

            return await this.propertyRepository.save(property);
        } catch (error) {
            if (error.code === '23503') {
                throw new BadRequestException('Invalid user reference');
            }

            console.error(error);
            throw new InternalServerErrorException('Failed to create property listing');
        }
    }

    async findAll(authUser?: { userId: number; email: string }): Promise<PropertyListing[]> {
        // Check read permission if user is authenticated
        if (authUser) {
            const canRead = await this.hasPermission(authUser.userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view property listings');
            }
        }

        return this.propertyRepository.find({ relations: ['addedBy'] });
    }

    async findOne(id: number, authUser?: { userId: number; email: string }): Promise<PropertyListing> {
        // Check read permission if user is authenticated
        if (authUser) {
            const canRead = await this.hasPermission(authUser.userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view property listings');
            }
        }

        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['addedBy']
        });

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        return property;
    }

    async update(
        id: number,
        dto: UpdatePropertyListingDto,
        authUser: { userId: number; email: string },
    ): Promise<PropertyListing> {
        // Find the property first
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['addedBy'],
        });

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        // Check if user is admin OR has update permission OR owns the property
        const isAdminUser = await this.isAdmin(authUser.userId);
        const isOwner = property.addedBy.id === authUser.userId;
        const canUpdate = await this.hasPermission(authUser.userId, 'canUpdate');

        if (!isAdminUser && !isOwner && !canUpdate) {
            throw new ForbiddenException('You do not have permission to update this property');
        }

        // If user is not admin and not owner, they need update permission
        if (!isAdminUser && !isOwner) {
            throw new ForbiddenException('You can only update your own properties');
        }

        // Merge updated fields
        Object.assign(property, dto);

        // Save and return
        return this.propertyRepository.save(property);
    }

    async approve(
        id: number,
        authUser: { userId: number; email: string },
    ): Promise<{ success: boolean; message: string }> {
        // Only admin can approve
        const isAdminUser = await this.isAdmin(authUser.userId);

        if (!isAdminUser) {
            throw new UnauthorizedException('Only administrators can approve properties');
        }

        // Find the property by id
        const property = await this.propertyRepository.findOne({
            where: { id },
        });

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        // Update approval status
        property.isApproved = true;
        await this.propertyRepository.save(property);

        return {
            success: true,
            message: 'Property approved successfully',
        };
    }

    async remove(
        id: number,
        authUser: { userId: number; email: string },
    ): Promise<{ message: string }> {
        // Find the property first
        const property = await this.propertyRepository.findOne({
            where: { id },
            relations: ['addedBy'],
        });

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        // Check if user is admin OR has delete permission OR owns the property
        const isAdminUser = await this.isAdmin(authUser.userId);
        const isOwner = property.addedBy.id === authUser.userId;
        const canDelete = await this.hasPermission(authUser.userId, 'canDelete');

        if (!isAdminUser && !isOwner && !canDelete) {
            throw new ForbiddenException('You do not have permission to delete this property');
        }

        // If user is not admin and not owner, they need delete permission
        if (!isAdminUser && !isOwner) {
            throw new ForbiddenException('You can only delete your own properties');
        }

        await this.propertyRepository.remove(property);

        return { message: 'Property deleted successfully' };
    }
}