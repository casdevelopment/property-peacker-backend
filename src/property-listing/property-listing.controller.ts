import { Express } from 'express'; // <-- important
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe, UseGuards, Req, UseInterceptors, UploadedFiles, Put, NotFoundException } from '@nestjs/common';
import { PropertyListingService } from './property-listing.service';
import { CreatePropertyListingDto } from './dto/create-property-listing.dto';
import { UpdatePropertyListingDto } from './dto/update-property-listing.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthGuard } from '@nestjs/passport';

@Controller('property-listings')
export class PropertyListingController {
    constructor(private readonly propertyService: PropertyListingService) { }

    // ---------------- CREATE ----------------
    @Post("add")
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const fileExt = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: CreatePropertyListingDto,
        @Req() req: any,
    ) {
        // Map files to URLs
        if (files && files.length > 0) {
            dto.images = files.map(f => `${process.env.PORT}/api/v1/uploads/${f.filename}`);
        }

        // Convert string fields to numbers
        dto.price = Number(dto.price);
        dto.yearlyTax = Number(dto.yearlyTax);
        dto.size = Number(dto.size);
        dto.plotSize = Number(dto.plotSize);
        dto.rooms = Number(dto.rooms);
        dto.bathrooms = Number(dto.bathrooms);
        dto.floors = Number(dto.floors);
        dto.garages = Number(dto.garages);
        dto.builtYear = Number(dto.builtYear);

        // No need to parse amenities anymore - the Transform decorator handles it

        dto.addedById = req.user.userId;

        return this.propertyService.create(dto, req.user);
    }

    // ---------------- FIND ALL ----------------
    @Get("getAll")
    @UseGuards(JwtAuthGuard)
    findAll() {
        return this.propertyService.findAll();
    }

    // ---------------- FIND ONE ----------------
    @Get('getById/:id')
    @UseGuards(JwtAuthGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.propertyService.findOne(id);
    }

    // ---------------- UPDATE ----------------
    @Put('update/:id')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(
        FilesInterceptor('images', 10, {
            storage: diskStorage({
                destination: './uploads',
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const fileExt = extname(file.originalname);
                    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
                },
            }),
            fileFilter: (req, file, cb) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return cb(new Error('Only image files are allowed!'), false);
                }
                cb(null, true);
            },
        }),
    )
    async update(
        @Param('id', ParseIntPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() dto: UpdatePropertyListingDto,
        @Req() req: any,
    ) {
        // Fetch existing property
        const property = await this.propertyService.findOne(id);
        if (!property) throw new NotFoundException('Property not found');

        // Handle images
        let updatedImages: string[] = property.images || [];
        if (files && files.length > 0) {
            // If multiple files uploaded, map all
            const newImages = files.map(
                (f) => `http://localhost:${process.env.PORT || 3000}/uploads/${f.filename}`
            );
            updatedImages = newImages; // <-- REPLACE old images with new ones
        }
        dto.images = updatedImages;

        // Convert numeric fields
        const numberFields = [
            'price', 'yearlyTax', 'size', 'plotSize',
            'rooms', 'bathrooms', 'floors', 'garages', 'builtYear'
        ];
        numberFields.forEach((field) => {
            if (dto[field] !== undefined) dto[field] = Number(dto[field]);
        });

        // Convert boolean fields
        if (dto.existingMember !== undefined) {
            dto.existingMember = dto.existingMember === true;
        }

        // Parse amenities array
        if (dto.amenities) {
            if (typeof dto.amenities === 'string') {
                try {
                    dto.amenities = JSON.parse(dto.amenities) as string[];
                } catch {
                    dto.amenities = [];
                }
            }
        } else {
            dto.amenities = [];
        }

        // Update property in DB
        const authUser = { userId: req.user.userId, email: req.user.email };
        const updatedProperty = await this.propertyService.update(id, dto, authUser);

        return {
            success: true,
            message: 'Property updated successfully',
            data: updatedProperty,
        };
    }

    @Delete('delete/:id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        return this.propertyService.remove(id, req.user);
    }


    @Post("approve/:id")
    @UseGuards(JwtAuthGuard)
    approve(@Param("id", ParseIntPipe) id: number, @Req() req: any) {
        const property = this.propertyService.approve(id, req.user)
        return property;
    }
}
