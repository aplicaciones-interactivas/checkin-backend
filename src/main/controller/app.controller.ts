import { Controller, Get } from '@nestjs/common';
import { AppService } from '../service/App.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
