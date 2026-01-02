import { userRole } from '../database/sequelize.js';

export const initializeRoles = async () => {
    const roles = [
        { id: 1, role: 'USER' },
        { id: 2, role: 'ADMIN' }
    ];

    for (const r of roles) {
        // Check if the role already exists
        const existing = await userRole.findByPk(r.id);
        if (!existing) {
            await userRole.create(r);
            console.log(`Created role: ${r.role}`);
        }
    }
};
