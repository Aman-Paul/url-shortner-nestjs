import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto, SignUpDto } from "./dto";

@Controller ('auth')
export class AuthController {
    constructor( private authService: AuthService ) {}

    @Post('signup')
    signup(@Body() dto: SignUpDto) {
        console.log(dto)
        return this.authService.signup(dto);
    }

    @HttpCode(HttpStatus.OK) // Send status code 200
    @Post ('signin')
    signin(@Body() dto: SignInDto) {
        return this.authService.signin(dto);
    }
}
