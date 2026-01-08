import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { BlogDescriptionDto } from './blog-description.dto';

export class CreateBlogDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => BlogDescriptionDto)
    description: BlogDescriptionDto[];
}
