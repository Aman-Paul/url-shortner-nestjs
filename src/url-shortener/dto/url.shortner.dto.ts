import { IsNotEmpty, IsString } from "class-validator";

export class UrlShortenerDto {
    @IsString()
    @IsNotEmpty()
    url: string
}