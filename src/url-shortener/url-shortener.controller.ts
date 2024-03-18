import { BadRequestException, Body, Controller, Get, Headers, Param, Post, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerDto } from './dto';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorator';
import { User } from '@prisma/client';
import { Response } from 'express';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';

@Controller()
export class UrlShortenerController {
    constructor(private urlShortenerService: UrlShortenerService){}
    
    @UseGuards(JwtGuard)
    @Post("short-url")
    shortUrl(@Body() dto: UrlShortenerDto, @GetUser() user: User) {
        return this.urlShortenerService.shortUrlService(dto, user);
    }

    @Get(":shortid")
    async redirectToId(@Param('shortid') shortId: string, @GetUser() user: User, @Res() res: Response, @Headers("user-agent") deviceType: string)  {
        const rediectUrl = await this.urlShortenerService.redirectUrlService(shortId, deviceType, user);

        if(!rediectUrl) {
            throw new BadRequestException("No data found") 
        }
        res.redirect(rediectUrl.url)
    }

    @UseGuards(JwtGuard)
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(10)
    @Get("analytics/:shortId")
    async urlAnalyticsHandler(@Param("shortId") shortId: string){
        return this.urlShortenerService.getUrlAnalytics(shortId);
    }
}
