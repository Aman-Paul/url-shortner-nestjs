import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { UrlShortenerService } from './url-shortener.service';
import { UrlShortenerDto } from './dto';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('short-url')
export class UrlShortenerController {
    constructor(private urlShortenerService: UrlShortenerService){}

    @Post("/")
    shortUrl(@Body() dto: UrlShortenerDto, @GetUser() user: User) {
        return this.urlShortenerService.shortUrlService(dto, user);
    }
}
