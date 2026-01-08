import { IsString } from 'class-validator';

export class BlogDescriptionDto {
    @IsString()
    heading: string;

    @IsString()
    text: string;
}
