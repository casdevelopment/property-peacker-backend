import { Controller, Put, Body, Param, UseGuards, Req, Get } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('permissions')
@UseGuards(JwtAuthGuard)
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) { }

    @Put('update/:userId')
    update(
        @Param('userId') userId: number,
        @Body() dto: UpdatePermissionDto,
        @Req() req: any,
    ) {
        return this.permissionsService.update(userId, dto, req.user.userId);
    }

    @Get('getPermission/:id')
    getPermission(
        @Param('id') id: number,
        @Req() req: any,
    ) {
        return this.permissionsService.getPermissionsAdmin(id, req.user.userId);
    }
}