import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
    ) { }

    // Create role if it doesn't exist
    async createRole(roleName: string): Promise<Role> {
        const existing = await this.roleRepository.findOne({ where: { role: roleName } });
        if (existing) return existing;

        const role = this.roleRepository.create({ role: roleName });
        return this.roleRepository.save(role);
    }

    // Seed roles: first 'user', then 'admin'
    async seedRoles(): Promise<void> {
        await this.createRole('user');
        await this.createRole('admin');
        console.log('✅ Roles seeded: user, admin');
    }

    async findByRole(roleName: string): Promise<Role> {
        return this.roleRepository.findOne({ where: { role: roleName } });
    }
}
