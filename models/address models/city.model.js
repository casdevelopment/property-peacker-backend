import { DataTypes } from "sequelize";

const citymodel = (sequelize) => {
    return sequelize.define("City", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, allowNull: false },
        state_id: { type: DataTypes.INTEGER, allowNull: false },
        country_id: { type: DataTypes.INTEGER, allowNull: false },
        iso: { type: DataTypes.STRING },
    })
};
export default citymodel;