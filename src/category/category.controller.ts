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
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    create(@Body() dto: CreateCategoryDto, @Req() req: Request) {
        return this.categoryService.create(dto, req.user['userId']);
    }

    @Get('getAll')
    @UseGuards(JwtAuthGuard)
    getAll() {
        return this.categoryService.findAll();
    }

    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateCategoryDto,
        @Req() req: Request,
    ) {
        return this.categoryService.update(id, dto, req.user['userId']);
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    delete(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: Request,
    ) {
        return this.categoryService.remove(id, req.user['userId']);
    }
}
