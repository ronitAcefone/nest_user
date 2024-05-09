import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Good to meet you. Nest JS server working great, Have are having a great day';
  }
}
