import { Controller, Get, Param, Query } from '@nestjs/common';
import * as fetch from 'node-fetch';

@Controller('places')
export class PlacesProxyController {

  private readonly API_KEY: string = '';

  @Get('/details/:id')
  public async getPlaceDetails(@Param('id') id) {

    return fetch('https://maps.googleapis.com/maps/api/place/details/json?key=' + this.API_KEY + '&place_id=' + id + '&language=ES',
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      }).then(res => res.json())
      .then(data => data.result);
  }

  @Get('/autocomplete')
  public async autocomplete(@Query('searchTerm')searchTerm: string) {
    let result = await fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?types=(cities)&input=' + searchTerm +
      '&key=' + this.API_KEY,
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    result = await (result.json());
    return result.predictions;
  }
}
