import { Injectable, ForbiddenException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PermissionsService {
    constructor(
        @InjectRepository(Permission)
        private readonly permissionRepo: Repository<Permission>,
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    // 🔹 Called from UserService when new user is created
    async createDefaultPermissions(userId: number) {
        const routes = [
            { route: '/blogs', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
            { route: '/comments', canCreate: true, canRead: true, canUpdate: false, canDelete: false },
            { route: '/categories', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
            { route: '/status', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
            { route: '/amenities', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
            { route: '/listproperty', canCreate: false, canRead: true, canUpdate: false, canDelete: false },
        ];

        const permission = this.permissionRepo.create({ userId, routes });
        return this.permissionRepo.save(permission);
    }

    // 🔹 Only admin can update any user's permissions
    async update(userId: number, dto: UpdatePermissionDto, adminId: number) {
        const admin = await this.userRepo.findOne({ where: { id: adminId } });
        if (!admin || admin.roleId !== 2) {
            throw new ForbiddenException('Only admin can update permissions');
        }

        const permission = await this.permissionRepo.findOne({ where: { userId } });
        if (!permission) throw new NotFoundException('Permissions not found for this user');

        permission.routes = dto.routes;
        return this.permissionRepo.save(permission);
    }

    async getPermissions(userId: number) {
        const permission = await this.permissionRepo.findOne({ where: { userId } });
        if (!permission) throw new NotFoundException('Permissions not found for this user');
        return permission;
    }
    async getPermissionsAdmin(userId: number, adminId: number) {
        // user id belongs to user who's permisions we are getting 
        //adminId is of user who is requestion
        const isAdmin = await this.userRepo.findOne({
            where: { id: userId, roleId: 2 },
        });
        if (!isAdmin) throw new UnauthorizedException('Only admin can view permisions')
        const permission = await this.permissionRepo.findOne({ where: { userId } });
        if (!permission) throw new NotFoundException('Permissions not found for this user');
        return permission;
    }
}
