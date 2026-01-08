import { Injectable } from '@nestjs/common';
import { Country, State, City } from 'country-state-city';

@Injectable()
export class LocationService {
    getAllCountries() {
        return Country.getAllCountries();
    }

    getStatesByCountry(countryIso: string) {
        return State.getStatesOfCountry(countryIso);
    }

    getCitiesByState(countryIso: string, stateIso: string) {
        return City.getCitiesOfState(countryIso, stateIso);
    }
}
