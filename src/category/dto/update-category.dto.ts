import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    category?: string;
}
