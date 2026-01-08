import {
    Controller,
    Post,
    Body,
    Get,
    Put,
    Delete,
    Param,
    Req,
    UseGuards,
    ParseIntPipe,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('status')
export class StatusController {
    constructor(private readonly statusService: StatusService) { }

    // 🔐 Admin
    @Post('create')
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateStatusDto, @Req() req: Request) {
        return this.statusService.create(dto, req.user['userId']);
    }

    // 🌍 Public
    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.statusService.findAll();
    }

    // 🔐 Admin
    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateStatusDto,
        @Req() req: Request,
    ) {
        return this.statusService.update(id, dto, req.user['userId']);
    }

    // 🔐 Admin
    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.statusService.remove(id, req.user['userId']);
    }
}
