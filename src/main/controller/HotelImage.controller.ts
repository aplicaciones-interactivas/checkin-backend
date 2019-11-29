import { Controller, Delete, Get, HttpCode, Param, Post, Query, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { HotelImageService } from '../service/HotelImage.service';
import { UserDecorator } from '../decorator/User.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { HotelImage } from '../entities/HotelImage';
import * as btoa from 'btoa';
import * as fetch from 'node-fetch';
import * as FormData from 'form-data';

@Controller('hotel-images')
export class HotelImageController {

  constructor(private hotelImageService: HotelImageService) {

  }

  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    return btoa(bytes.reduce((data, byte) => {
      return data + String.fromCharCode(byte);
    }, ''));
  }

  @Post('/:hotelId')
  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async uploadImage(@UploadedFiles() files, @Param('hotelId') hotelId: number, @UserDecorator() user: LoggedUserDto): Promise<HotelImage[]> {
    return Promise.all(files.map((file: any) => {
      const formData: FormData = new FormData();
      formData.append('file', 'data:' + file.mimeType + ';base64,' + this.arrayBufferToBase64(file.buffer));
      formData.append('upload_preset', 'eelihf3n');
      return fetch('https://api.cloudinary.com/v1_1/hsnxf3jhs/image/upload', {
        method: 'POST',
        body: formData,
      });
    })).then((filesResponse) => {
      return Promise.all(filesResponse.map((fileResponse: any) => fileResponse.json()));
    })
      .then(datas => datas.map((data: any) => data.url))
      .then(urls => this.hotelImageService.save(urls, hotelId, user));
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  async deleteImage(@Query('ids') ids: number[], @UserDecorator() user: LoggedUserDto) {
    await this.hotelImageService.delete(ids, user);
  }

  @Get('/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    return fetch(fileId);
  }
}
