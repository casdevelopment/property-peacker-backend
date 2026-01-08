import { User } from './../user/entities/user.entity';
import {
    Injectable,
    ForbiddenException,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,

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
     * Helper method to get categories permission for a user
     */
    private async getCategoriesPermission(userId: number) {
        const permissions = await this.permissionsService.getPermissions(userId);

        // If permissions is an array
        if (Array.isArray(permissions)) {
            return permissions.find(p => p.route === '/categories');
        }

        // If permissions is an object with routes property
        if (permissions && permissions.routes && Array.isArray(permissions.routes)) {
            return permissions.routes.find(p => p.route === '/categories');
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
        const permission = await this.getCategoriesPermission(userId);
        return permission?.[action] === true;
    }

    async create(dto: CreateCategoryDto, userId: number) {
        // Check if user is admin OR has create permission
        const canCreate = await this.hasPermission(userId, 'canCreate');

        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create categories');
        }

        try {
            const category = this.categoryRepo.create({
                category: dto.category,
                addedBy: userId,
            });

            const savedCategory = await this.categoryRepo.save(category);

            return {
                success: true,
                message: 'Category created successfully',
                data: savedCategory,
            };
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                (error as any).code === '23505'
            ) {
                throw new ConflictException('Category already exists');
            }
            throw error;
        }
    }

    async findAll(userId?: number) {
        // Check read permission if user is authenticated
        if (userId) {
            const canRead = await this.hasPermission(userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view categories');
            }
        }

        const categories = await this.categoryRepo.find({
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Categories fetched successfully',
            data: categories,
        };
    }

    async update(id: number, dto: UpdateCategoryDto, userId: number) {
        // Check if user is admin OR has update permission
        const canUpdate = await this.hasPermission(userId, 'canUpdate');

        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update categories');
        }

        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        try {
            Object.assign(category, dto);
            const updatedCategory = await this.categoryRepo.save(category);

            return {
                success: true,
                message: 'Category updated successfully',
                data: updatedCategory,
            };
        } catch (error) {
            if (
                error instanceof QueryFailedError &&
                (error as any).code === '23505'
            ) {
                throw new ConflictException('Category already exists');
            }
            throw error;
        }
    }

    async remove(id: number, userId: number) {
        // Check if user is admin OR has delete permission
        const canDelete = await this.hasPermission(userId, 'canDelete');

        if (!canDelete) {
            throw new ForbiddenException('You do not have permission to delete categories');
        }

        const category = await this.categoryRepo.findOne({ where: { id } });
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        await this.categoryRepo.remove(category);

        return {
            success: true,
            message: 'Category deleted successfully',
        };
    }
}