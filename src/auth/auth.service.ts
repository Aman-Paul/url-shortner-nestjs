import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { SignUpDto, SignInDto } from "./dto";
import * as argon from 'argon2';
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
// import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) {} // PrismaClient

    async signup(dto: SignUpDto): Promise<{ access_token: string }> {
        // generate the password hash
        const hash = await argon.hash(dto.password);
        
        try {      
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash,
                }
            });
    
            const token =  await this.signToken(user.id, user.email)

            // send the token
            return {
                access_token: token
            };
        } catch (error) {
            // if( error instanceof PrismaClientKnownRequestError ) {
                if(error.code === 'P2002') {
                    throw new ForbiddenException('Credentials already exists.')
                }
            // }

            throw error;
        }
    }

    async signin( dto: SignInDto): Promise<{ access_token: string }> {
        // find the user by email
        const user = await this.prisma.user.findUnique({
            where: {
                email: dto.email
            }
        })
        // If user does not exists throw exception
        if(!user) throw new ForbiddenException('Credetials incorrect.');

        //compare password
        const pwMatches = await argon.verify(user.hash, dto.password);
        if(!pwMatches) throw new ForbiddenException('Credentials incorrect.');

        const token =  await this.signToken(user.id, user.email)

        // send the token
        return {
            access_token: token
        };
    }

    signToken ( userId: number, email: string): Promise<string> {
        const payload = {
            sub: userId,
            email
        }

        const secret = this.config.get('JWT_SECRET');

        return this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret
        })
    }
}