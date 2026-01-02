import { DataTypes } from "sequelize";


const postalCodeModel = (sequelize) => {
    return sequelize.define("PostalCode", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        code: { type: DataTypes.STRING, allowNull: false },
    });
};

export default postalCodeModel;