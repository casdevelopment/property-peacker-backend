import { City, Country, State } from "../database/sequelize.js";


export const getAllCountries = async (req, res, next) => {
    try {
        // Logic to fetch all countries from the database
        const countries = await Country.findAll({
            attributes: ["id", "name"],
        });
        res.status(200).json({
            success: true,
            data: countries,
        });
    } catch (error) {
        next(error);
    }
};
export const getStates = async (req, res, next) => {
    try {
        let countryId = req.params.countryId;
        const states = await State.findAll({
            where: { country_id: countryId },
            attributes: ["id", "name"],
        });
        res.status(200).json({
            success: true,
            data: states,
        });
    } catch (error) {
        next(error);
    }
}
export const getAllCities = async (req, res, next) => {
    try {
        let stateId = req.params.stateId;
        const cities = await City.findAll({
            where: { state_id: stateId },
            attributes: ["id", "name"],
        });
        res.status(200).json({
            success: true,
            data: cities,
        });
    } catch (error) {
        next(error);
    }
};