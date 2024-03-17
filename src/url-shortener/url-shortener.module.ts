import { Module } from '@nestjs/common';
import { UrlShortenerController } from './url-shortener.controller';
import { UrlShortenerService } from './url-shortener.service';
import { UserScheduler } from './url-shortener.schedular';

@Module({
  controllers: [UrlShortenerController],
  providers: [UrlShortenerService, UserScheduler]
})
export class UrlShortenerModule {}
