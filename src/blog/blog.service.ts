import {
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { User } from '../user/entities/user.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(Blog)
        private blogRepo: Repository<Blog>,

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
     * Helper method to get blogs permission for a user
     */
    private async getBlogsPermission(userId: number) {
        const permissions = await this.permissionsService.getPermissions(userId);

        // If permissions is an array
        if (Array.isArray(permissions)) {
            return permissions.find(p => p.route === '/blogs');
        }

        // If permissions is an object with routes property
        if (permissions && permissions.routes && Array.isArray(permissions.routes)) {
            return permissions.routes.find(p => p.route === '/blogs');
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
        const permission = await this.getBlogsPermission(userId);
        return permission?.[action] === true;
    }

    async create(
        dto: CreateBlogDto,
        imagePath: string,
        userId: number,
    ) {
        // Check if user is admin OR has create permission
        const canCreate = await this.hasPermission(userId, 'canCreate');

        if (!canCreate) {
            throw new ForbiddenException('You do not have permission to create blogs');
        }

        const blog = this.blogRepo.create({
            image: imagePath,
            description: dto.description,
            addedById: userId,
        });

        return this.blogRepo.save(blog);
    }

    async findAll(userId?: number) {
        // Check read permission if user is authenticated
        if (userId) {
            const canRead = await this.hasPermission(userId, 'canRead');

            if (!canRead) {
                throw new ForbiddenException('You do not have permission to view blogs');
            }
        }

        const blogs = await this.blogRepo.find({
            order: { createdAt: 'DESC' },
        });

        return {
            success: true,
            message: 'Blogs fetched successfully',
            data: blogs,
        };
    }

    async update(
        id: number,
        dto: UpdateBlogDto,
        imagePath: string | undefined,
        userId: number,
    ) {
        // Check if user is admin OR has update permission
        const canUpdate = await this.hasPermission(userId, 'canUpdate');

        if (!canUpdate) {
            throw new ForbiddenException('You do not have permission to update blogs');
        }

        const blog = await this.blogRepo.findOne({ where: { id } });
        if (!blog) throw new NotFoundException('Blog not found');

        if (dto.description) blog.description = dto.description;
        if (imagePath) blog.image = imagePath;

        const updated = await this.blogRepo.save(blog);

        return {
            success: true,
            message: 'Blog updated successfully',
            data: updated,
        };
    }

    async remove(id: number, userId: number) {
        // Check if user is admin OR has delete permission
        const canDelete = await this.hasPermission(userId, 'canDelete');

        if (!canDelete) {
            throw new ForbiddenException('You do not have permission to delete blogs');
        }

        const blog = await this.blogRepo.findOne({ where: { id } });
        if (!blog) throw new NotFoundException('Blog not found');

        await this.blogRepo.remove(blog);

        return {
            success: true,
            message: 'Blog deleted successfully',
        };
    }
}