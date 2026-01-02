
import { DataTypes } from 'sequelize';

const ProppertyListingModel = (Sequelize) => {
    return Sequelize.define("PropertyListing", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        property_added_by: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'users', key: 'id' }
        },
        property_title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Title is required" },
                len: { args: [5, 100], msg: "Title must be between 5 and 100 characters" }
            },
        },
        property_description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Description is required" },
                len: { args: [600, Infinity], msg: "Description must be more than 600  characters" }
            },
        },
        property_category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Category is required" },
            },
        },
        property_status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Property status is required" },
            },
        },
        property_price: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Price is required" },
                isDecimal: { msg: "Price must be a decimal value" },
                min: {
                    args: [5],
                    msg: "Price must be at least 5"
                },
            },
        },
        yearly_tax: {
            type: DataTypes.DECIMAL,
            allowNull: false,
            validate: {
                isDecimal: { msg: "Yearly tax must be a decimal value" },
                min: {
                    args: [0],
                    msg: "Yearly tax cannot be negative"
                }
            },
        },
        property_images: {
            type: DataTypes.JSON,
            allowNull: false,
            validate: {
                notEmpty: { msg: "At least one property image is required" },
            },
        },
        property_address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Address is required" }
            }
        },
        property_country: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Country is required" }
            }
        },
        property_state: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "State is required" }
            }
        },
        property_zipcode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Zipcode is required" },
                len: { args: [4, 10], msg: "Zipcode must be between 4 and 10 characters" }
            }
        },
        property_size_ft: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Property size in ft is required" },
                len: { args: [3], msg: "Property size must be at least 3 characters" }
            }
        },
        property_plot_size_ft: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Property plot size in ft is required" },
                len: { args: [3], msg: "Property size must be at least 3 characters" }

            }
        },
        property_rooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Number of rooms is required" },
                min: {
                    args: [1],
                    msg: "There must be at least 1 room",
                }
            }
        },
        property_bathrooms: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Number of bathrooms is required" },
                min: {
                    args: [1],
                    msg: "There must be at least 1 bathroom",
                }
            }
        },
        property_garages: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Number of garage spaces is required" }
            }
        },
        property_floors: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Number of floors is required" },
                min: {
                    args: [1],
                    msg: "There must be at least 1 floor",
                }
            }
        },
        property_built_year: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Built year is required" },
                isValidYear(value) {
                    const currentYear = new Date().getFullYear();
                    if (value > currentYear) {
                        throw new Error(`Built year cannot be greater than ${currentYear}`);
                    }
                    if (value < 1950) { // optional: check for unrealistically old year
                        throw new Error("Built year is too old");
                    }
                }
            }
        },
        property_structure_type: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Structure type is required" },
                len: { args: [5], msg: "Structure type must be at least 5 characters" }
            }
        },
        property_extra_details: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: { args: [0, Infinity], msg: "Extra details must be less than 2000 characters" }
            }
        },
        property_membership_status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Membership status should not be empty" }
            }
        },
        property_email: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: "Contact email is required" },
                isEmail: { msg: "Please provide a valid email address" },
                isLowercase: true
            }
        },
        // property_password: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     validate: {
        //         notEmpty: { msg: "Contact password is required" },
        //         len: { args: [6, Infinity], msg: "Password must be at least 6 characters long" }
        //     }
        // },
        property_amenities: {
            type: DataTypes.JSON,
            allowNull: true,
            validate: {
                len: { args: [0, 50], msg: "Amenities must be less than 50 characters" }
            }
        },
        is_property_approved: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,

        }

    }, {
        timestamps: true,
        tableName: "property_listings",
        hooks: {

        }
    }

    )
}
export default ProppertyListingModel;