import { IsString, IsNotEmpty, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreatePropertyListingDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    category: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsNumber()
    @Type(() => Number)
    price: number;

    @IsNumber()
    @Type(() => Number)
    yearlyTax: number;

    @IsArray()
    @IsOptional()
    @Type(() => String)
    images: string[];

    @IsNotEmpty()
    @IsString()
    streetAddress: string;

    @IsNotEmpty()
    @IsString()
    country: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    zipcode: string;

    @IsNumber()
    @Type(() => Number)
    size: number;

    @IsNumber()
    @Type(() => Number)
    plotSize: number;

    @IsNumber()
    @Type(() => Number)
    rooms: number;

    @IsNumber()
    @Type(() => Number)
    bathrooms: number;

    @IsNumber()
    @Type(() => Number)
    floors: number;

    @IsNumber()
    @Type(() => Number)
    garages: number;

    @IsNumber()
    @Type(() => Number)
    builtYear: number;

    @IsNotEmpty()
    @IsString()
    structureType: string;

    @IsOptional()
    @IsString()
    extraDetails?: string;

    @IsBoolean()
    @Type(() => Boolean)
    existingMember: boolean;

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    addedById: number;

    @IsOptional()
    @IsArray()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            try {
                return JSON.parse(value);
            } catch {
                return [];
            }
        }
        return Array.isArray(value) ? value : [];
    })
    amenities?: string[];
}
