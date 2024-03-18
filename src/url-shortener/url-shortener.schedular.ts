import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UrlShortenerService } from './url-shortener.service';

@Injectable()
export class UserScheduler {
  constructor(private readonly urlShortner: UrlShortenerService) {}

  // @Cron('0 * * * * *') // runs every minutes
  // @Cron('0 0 * * *') // runs every day at midnight
@Cron('0 * * * *') // runs every hour
async handleDeactivateInactiveUsers() {
    await this.urlShortner.deleteExpiredUrls();
  }
}
