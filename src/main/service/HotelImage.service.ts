import { HotelImage } from '../entities/HotelImage';
import { extname } from 'path';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HotelImageRepository } from '../repository/HotelImage.repository';
import { User } from '../entities/User';
import { HotelRepository } from '../repository/Hotel.repository';
import * as fs from 'fs';

@Injectable()
export class HotelImageService {

  constructor(private hotelImageRepository: HotelImageRepository, private hotelRepository: HotelRepository) {
  }

  public async save(paths: string[], id: number, user: User): Promise<HotelImage[]> {
    if ((await this.hotelRepository.findById(id)).userId !== user.id && !user.hasRole('SUPERUSER')) {
      throw new UnauthorizedException();
    }
    const hotelImages = paths.map(path => {
      const hotelImage = new HotelImage();
      hotelImage.hotelId = id;
      hotelImage.path = path;
      hotelImage.format = extname(path);
      return hotelImage;
    });
    return this.hotelImageRepository.save(hotelImages);
  }

  public async delete(ids: number[], user: User) {
    const hotelImages = await this.hotelImageRepository.findByIds(ids);
    hotelImages.forEach((hotelImage: HotelImage) => {
      if (hotelImage.hotel.userId === user.id) {
        throw new UnauthorizedException();
      }
    });
    (await this.hotelImageRepository.findByIds(ids)).forEach(hi => {
      fs.unlinkSync(hi.path);
    });
    await this.hotelImageRepository.delete(ids);
  }
}
