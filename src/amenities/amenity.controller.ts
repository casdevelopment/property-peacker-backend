import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AmenityService } from './amenity.service';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('amenities')
export class AmenityController {
    constructor(private readonly amenityService: AmenityService) { }

    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    async findAll() {
        return this.amenityService.findAll();
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    async create(@Body() dto: CreateAmenityDto, @Req() req) {
        return this.amenityService.create(dto, req.user.userId);
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: number, @Body() dto: UpdateAmenityDto, @Req() req) {
        return this.amenityService.update(id, dto, req.user.userId);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: number, @Req() req) {
        return this.amenityService.remove(id, req.user.userId);
    }
}
