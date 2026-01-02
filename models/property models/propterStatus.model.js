import { DataTypes } from "sequelize";


const propertyStatusModel = (sequelize) => {
    return sequelize.define("PropertyStatus", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "Status name is required" },
                len: { args: [3, 50], msg: "Status name must be between 3 and 50 characters" },
                isString(value) {
                    if (typeof value !== "string") {
                        throw new Error("Status must be a string");
                    }
                },
                notOnlySpaces(value) {
                    if (!value.trim()) {
                        throw new Error("Status cannot contain only spaces");
                    }
                }
            }
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        }

    });
}

export default propertyStatusModel;