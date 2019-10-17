import { HotelImage } from '../entities/HotelImage';
import { extname } from 'path';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HotelImageRepository } from '../repository/HotelImage.repository';
import { User } from '../entities/User';
import { HotelRepository } from '../repository/Hotel.repository';
import * as fs from 'fs';
import { LoggedUserDto } from '../api/request/user/LoggedUser.dto';
import { PermissionUtils } from '../utils/Permission.utils';

@Injectable()
export class HotelImageService {

  constructor(private hotelImageRepository: HotelImageRepository, private hotelRepository: HotelRepository) {
  }

  public async save(paths: string[], id: number, user: LoggedUserDto): Promise<HotelImage[]> {
    if ((await this.hotelRepository.findById(id)).userId !== user.id && PermissionUtils.hasRole(user, 'SUPERUSER')) {
      throw new UnauthorizedException();
    }
    const hotelImages = paths.map(path => {
      const hotelImage = new HotelImage();
      hotelImage.hotelId = id;
      hotelImage.path = path;
      return hotelImage;
    });
    return this.hotelImageRepository.save(hotelImages);
  }

  public async delete(ids: number[], user: User) {
    const hotelImages = await this.hotelImageRepository.findByIds(ids);

    await this.asyncForEach(hotelImages, async (hotelImage) => {
      const hotel = await hotelImage.hotel;
      if (hotel.userId !== user.id) {
        throw new UnauthorizedException();
      }
    });

    (await this.hotelImageRepository.findByIds(ids)).forEach(hi => {
      fs.unlinkSync(hi.path);
    });
    await this.hotelImageRepository.delete(ids);
  }

  private async asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
