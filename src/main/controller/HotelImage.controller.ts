import { Controller, Delete, Get, HttpCode, Param, Post, Query, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { HotelImageService } from '../service/HotelImage.service';
import { User } from '../decorator/User.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';

@Controller('hotel-image')
export class HotelImageController {

  constructor(private hotelImageService: HotelImageService) {
  }

  @Post('/:hotelId')
  @UseInterceptors(FilesInterceptor('files',
    undefined, {
      storage: diskStorage({
        destination: './hotel-images',
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
          return cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    },
    ),
  )
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public async uploadImage(@UploadedFiles() files, @Param('hotelId') hotelId: number, @User() user: any) {
    return this.hotelImageService.save(files.map(file => file.path), hotelId, user);
  }

  @Delete()
  @HttpCode(204)
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public async deleteImage(@Query('ids') ids: number[], @User() user: any) {
    await this.hotelImageService.delete(ids, user);
  }

  @Get('/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'hotel-images' });
  }
}
