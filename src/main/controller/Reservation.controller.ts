import { LoggedUserDto } from '../dto/user/LoggedUser.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../auth/guards/Role.guard';
import { Reservation } from '../entities/Reservation';
import { UserDecorator } from '../decorator/User.decorator';
import { CreateReservationDto } from '../dto/reservation/CreateReservation.dto';
import { ReservationService } from '../service/Reservation.service';

@Controller('reservation')
export class ReservationController {

  constructor(private reservationService: ReservationService) {
  }

  @Get('/me')
  @UseGuards(AuthGuard('jwt'))
  public getMyReservations(@UserDecorator()user: LoggedUserDto): Promise<Reservation[]> {
    return this.reservationService.getMyReservations(user);
  }

  @Get('/byHotelId/:hotelId')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['SUPERUSER', 'ADMIN']))
  public getReservationsByHotelId(@Param('hotelId')hotelId: number, @UserDecorator() user: LoggedUserDto): Promise<Reservation[]> {
    return this.reservationService.getReservationsByHotelId(hotelId, user);
  }

  @Post('')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['USER']))
  public reserve(@Body() reservation: CreateReservationDto, @UserDecorator() user: LoggedUserDto) {
    return this.reservationService.reserve(reservation, user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard(['USER']))
  public unreserve(@Param() id: number, @UserDecorator() user: LoggedUserDto) {
    return this.reservationService.unreserve(id, user);
  }

  @Get('/calculateTotal')
  public calculateTotal(@Query('roomTypeId') roomTypeId: number, @Query('from') from: string, @Query('until') until: string) {
    return this.reservationService.getTotalPrice(roomTypeId, from, until);
  }
}
