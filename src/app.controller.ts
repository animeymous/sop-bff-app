import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post()
  async sendEmail(@Body() body){
    try{
      const data = await this.appService.sendEmailToUser(body);
      return data;
    }catch (error){
      return error
    }
  }
}
