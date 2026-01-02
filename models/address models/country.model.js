// models/Country.js
import { DataTypes } from "sequelize";

const countryModel = (sequelize) => {
    return sequelize.define("Country", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        iso2: { type: DataTypes.STRING },
        iso3: { type: DataTypes.STRING },

    })
};

export default countryModel;
