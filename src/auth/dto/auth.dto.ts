import { IsEmail, IsNotEmpty, IsOptional, IsString} from "class-validator"

export class SignInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}

export class SignUpDto {
    @IsString()
    @IsNotEmpty()
    firstName: string

    @IsOptional()
    lastName: string

    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string
}