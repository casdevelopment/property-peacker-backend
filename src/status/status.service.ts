import { User } from './../user/entities/user.entity';
import {
    Injectable,
    ForbiddenException,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class StatusService {
    constructor(
        @InjectRepository(Status)
        private statusRepo: Repository<Status>,

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
     * Helper method to get status permission for a user
     */
    private async getStatusPermission(userId: number) {
        const permissions = await this.permissionsService.getPermissions(userId);

        // If permissions is an array
        if (Array.isArray(permissions)) {
            return permissions.find(p => p.route === '/status');
        }

        // If permissions is an object with routes property
        if (permissions && permissions.routes && Array.isArray(permissions.routes)) {
            return permissions.routes.find(p => p.route === '/status');
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
        const permission = await this.getStatusPermission(userId);
        return permission?.[action] === true;
    }

    async create(dto: CreateStatusDto, userId: number) {
        // Check if user is admin OR has create permission
        const canCreate = await this.hasPermission(userId, 'canCreate');

        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create statuses');
        }

        try {
            const status = this.statusRepo.create({
                status: dto.status,
                addedBy: userId,
            });

            const savedStatus = await this.statusRepo.save(status);

            return {
                success: true,
                message: 'Status created successfully',
                data: savedStatus,
            };
        } catch (error) {
            // 🔥 PostgreSQL UNIQUE constraint
            if (
                error instanceof QueryFailedError &&
                (error as any).code === '23505'
            ) {
                throw new ConflictException('Status already exists');
            }

            throw error; // let Nest handle other errors
        }
    }

    async findAll(userId?: number) {
        // Check read permission if user is authenticated
        if (userId) {
            const canRead = await this.hasPermission(userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view statuses');
            }
        }

        const statuses = await this.statusRepo.find({
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Statuses fetched successfully',
            data: statuses,
        };
    }

    async update(id: number, dto: UpdateStatusDto, userId: number) {
        // Check if user is admin OR has update permission
        const canUpdate = await this.hasPermission(userId, 'canUpdate');

        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update statuses');
        }

        const status = await this.statusRepo.findOne({ where: { id } });
        if (!status) {
            throw new NotFoundException('Status not found');
        }

        Object.assign(status, dto);
        const updatedStatus = await this.statusRepo.save(status);

        return {
            success: true,
            message: 'Status updated successfully',
            data: updatedStatus,
        };
    }

    async remove(id: number, userId: number) {
        // Check if user is admin OR has delete permission
        const canDelete = await this.hasPermission(userId, 'canDelete');

        if (!canDelete) {
            throw new ForbiddenException('You do not have permission to delete statuses');
        }

        const status = await this.statusRepo.findOne({ where: { id } });
        if (!status) {
            throw new NotFoundException('Status not found');
        }

        await this.statusRepo.remove(status);

        return {
            success: true,
            message: 'Status deleted successfully',
        };
    }
}