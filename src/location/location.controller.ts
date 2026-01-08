import { Controller, Get, Param } from '@nestjs/common';
import { LocationService } from './location.service';

@Controller('location')
export class LocationController {
    constructor(private readonly locationService: LocationService) { }

    // GET /location/countries
    @Get('countries')
    getCountries() {
        return this.locationService.getAllCountries();
    }

    // GET /location/states/:countryIso
    @Get('states/:countryIso')
    getStates(@Param('countryIso') countryIso: string) {
        return this.locationService.getStatesByCountry(countryIso);
    }

    // GET /location/cities/:countryIso/:stateIso
    @Get('cities/:countryIso/:stateIso')
    getCities(
        @Param('countryIso') countryIso: string,
        @Param('stateIso') stateIso: string,
    ) {
        return this.locationService.getCitiesByState(countryIso, stateIso);
    }
}
