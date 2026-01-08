import { IsArray, ValidateNested, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class RouteDto {
    @IsString()
    route: string;

    @IsBoolean()
    canCreate: boolean;

    @IsBoolean()
    canRead: boolean;

    @IsBoolean()
    canUpdate: boolean;

    @IsBoolean()
    canDelete: boolean;
}

export class UpdatePermissionDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RouteDto)
    routes: RouteDto[];
}
