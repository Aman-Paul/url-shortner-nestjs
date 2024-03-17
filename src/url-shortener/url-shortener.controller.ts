import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';
import { Response } from 'express';

@Controller()
export class UrlShortenerController {
    constructor(private urlShortenerService: UrlShortenerService){}
    
    @UseGuards(JwtGuard)
    @Post("short-url")
    shortUrl(@Body() dto: UrlShortenerDto, @GetUser() user: User) {
        return this.urlShortenerService.shortUrlService(dto, user);
    }

    @Get(":shortid")
    async redirectToId(@Param('shortid') shortId: string, @GetUser() user: User, @Res() res: Response) {
        const rediectUrl = await this.urlShortenerService.redirectUrlService(shortId, user);

        if(!rediectUrl) {
            throw "no data found" 
        }


        res.redirect(rediectUrl.url)
    }
}
