import { DataTypes } from "sequelize";


const propertyCategoryModel = (sequelize) => {
    return sequelize.define("PropertyCategory", {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: { msg: "Category name is required" },
                len: { args: [3, 50], msg: "Category name must be between 3 and 50 characters" },
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

            },
        },
        added_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        },
    });
}

export default propertyCategoryModel;