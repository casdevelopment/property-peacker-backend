import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateAmenityDto {
    @IsOptional()
    @IsNotEmpty()
    amenity?: string;
}
