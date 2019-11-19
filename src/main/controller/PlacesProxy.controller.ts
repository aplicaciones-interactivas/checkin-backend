import { Controller, Get, Param, Query } from '@nestjs/common';
import * as fetch from 'node-fetch';

@Controller('places')
export class PlacesProxyController {

  private readonly API_KEY: string = 'AIzaSyCr93elOowQMq5CQulQLhXLhsJhMR6BIRY';
  private readonly COUNTRY_SERVICE: string = 'https://restcountries.eu/rest/v2/alpha/';
  private readonly PLACES_SERVICE: string = 'https://maps.googleapis.com/maps/api/place';

  @Get('/details/:id')
  public async getPlaceDetails(@Param('id') id) {
    return fetch(`${this.PLACES_SERVICE}/details/json?key=${this.API_KEY}&place_id=${id}&language=ES`,
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
    let result = await fetch(`${this.PLACES_SERVICE}/autocomplete/json?types=(cities)&input=${searchTerm}&key=${this.API_KEY}`,
      {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
        },
      });
    result = await (result.json());
    return result.predictions;
  }

  @Get('country/:code')
  public async getCountry(@Param('code') code: string) {
    return fetch(`${this.COUNTRY_SERVICE}${code}`)
      .then(res => res.json());
  }
}
