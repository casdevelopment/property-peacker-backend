import { Country, State, City, sequelize } from '../database/sequelize.js';
import { Country as CSCountry, State as CSState, City as CSCity } from 'country-state-city';


async function addLocations() {
    try {
        await sequelize.sync({ alter: true });

        const countryMap = new Map(); // key = country ISO, value = DB id
        const stateMap = new Map();   // key = state ISO + country ISO, value = DB id
        const cityMap = new Map();    // key = city name + country ISO, value = DB id

        // -------------------
        // 1️⃣ Seed Countries
        // -------------------
        const countries = CSCountry.getAllCountries();
        console.log(`Total countries to seed: ${countries.length}`);

        for (const country of countries) {
            const [countryRecord] = await Country.findOrCreate({
                where: { name: country.name },
                defaults: { name: country.name }
            });
            countryMap.set(country.isoCode, countryRecord.id);
        }

        console.log(`Countries seeded: ${countryMap.size}`);

        // -------------------
        // 2️⃣ Seed States
        // -------------------
        for (const country of countries) {
            const states = CSState.getStatesOfCountry(country.isoCode);
            if (!states || states.length === 0) continue;

            for (const state of states) {
                const [stateRecord] = await State.findOrCreate({
                    where: {
                        name: state.name,
                        country_id: countryMap.get(country.isoCode)
                    },
                    defaults: {
                        name: state.name,
                        country_id: countryMap.get(country.isoCode),
                        iso: state.isoCode
                    }
                });
                stateMap.set(`${state.isoCode}-${country.isoCode}`, stateRecord.id);
            }
        }

        console.log(`States seeded: ${stateMap.size}`);

        // -------------------
        // 3️⃣ Seed Cities
        // -------------------
        for (const country of countries) {
            const states = CSState.getStatesOfCountry(country.isoCode);
            if (!states || states.length === 0) continue;

            for (const state of states) {
                const state_id = stateMap.get(`${state.isoCode}-${country.isoCode}`);
                if (!state_id) {
                    console.warn(`Skipping state ${state.name} in ${country.name} (state_id not found)`);
                    continue;
                }

                const cities = CSCity.getCitiesOfState(country.isoCode, state.isoCode);
                if (!cities || cities.length === 0) continue;

                for (const city of cities) {
                    const [cityRecord] = await City.findOrCreate({
                        where: {
                            name: city.name,
                            state_id
                        },
                        defaults: {
                            name: city.name,
                            state_id,
                            country_id: countryMap.get(country.isoCode),
                            iso: city.countryCode
                        }
                    });

                    cityMap.set(`${city.name}-${city.countryCode}`, cityRecord.id);
                }
            }
        }

        console.log(`Cities seeded: ${cityMap.size}`);
        console.log('✅ All seeding completed successfully!');
    } catch (err) {
        console.error('Seeder error:', err);
    }
}

export default addLocations;
