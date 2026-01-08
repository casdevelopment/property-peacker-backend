import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
    Req,
    UploadedFile,
    UseInterceptors,
    BadRequestException,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('blogs')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

    @Get('getAll')
    findAll() {
        return this.blogService.findAll();
    }

    @Post('create')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    create(
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Req() req,
    ) {
        const description = JSON.parse(body.description);

        return this.blogService.create(
            { description },
            file?.path,
            req.user.userId,
        );
    }



    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('image'))
    update(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
        @Body() body: any,
        @Req() req,
    ) {
        let dto: any = {};

        // 🔥 Parse description ONLY if present
        if (body.description) {
            dto.description = JSON.parse(body.description);
        }

        return this.blogService.update(
            id,
            dto,
            file?.path,
            req.user.userId,
        );
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: number, @Req() req) {
        return this.blogService.remove(id, req.user.userId);
    }
}
