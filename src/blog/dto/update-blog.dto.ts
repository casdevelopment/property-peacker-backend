import { IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogDescriptionDto } from './blog-description.dto';

export class UpdateBlogDto {
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BlogDescriptionDto)
    description?: BlogDescriptionDto[];
}
