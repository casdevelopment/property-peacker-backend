import { Sequelize } from 'sequelize';
import { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD, NODE_ENV } from '../config/env.js';

// Import model *functions* (not initialized yet)
import UserModel from '../models/user models/user.model.js';
import UserRoleModel from '../models/user models/userRole.model.js';
import OtpModel from '../models/user models/otp.model.js';
import PasswordResetTokenModel from '../models/user models/passwordResetToken.model.js';
import ProppertyListingModel from '../models/property models/propertyListing.model.js';
import countryModel from '../models/address models/country.model.js';
import stateModel from '../models/address models/state.model.js';
import citymodel from '../models/address models/city.model.js';
import postalCodeModel from '../models/address models/postalcode.model.js';
import propertyCategoryModel from '../models/property models/propertyCategory.model.js';
import propertyStatusModel from '../models/property models/propterStatus.model.js';
import amenitiesModel from '../models/Amenities model/amenity.model.js';

if (!DB_HOST || !DB_NAME || !DB_USER || DB_PASSWORD === undefined) {
  throw new Error(
    'Please define DB_HOST, DB_NAME, DB_USER, and DB_PASSWORD environment variables inside .env.<development/production>.local'
  );
}

// Initialize Sequelize
export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT || 3306,
  dialect: 'mysql',
  logging: NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Initialize models


export const User = UserModel(sequelize);
export const userRole = UserRoleModel(sequelize);
export const Otp = OtpModel(sequelize);
export const PasswordResetToken = PasswordResetTokenModel(sequelize);
export const PropertyListing = ProppertyListingModel(sequelize);
export const Country = countryModel(sequelize);
export const State = stateModel(sequelize);
export const City = citymodel(sequelize);
export const PostalCode = postalCodeModel(sequelize);
export const PropertyCategory = propertyCategoryModel(sequelize);
export const PropertyStatus = propertyStatusModel(sequelize);
export const Amenity = amenitiesModel(sequelize);


// Define associations *after models are initialized*
userRole.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(userRole, { foreignKey: 'roleId', as: 'role' });

User.hasMany(Otp, { foreignKey: 'userId', as: 'otps', onDelete: 'CASCADE' });
Otp.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' });


User.hasMany(PasswordResetToken, { foreignKey: 'userId', as: 'passwordResetTokens', onDelete: 'CASCADE' });
PasswordResetToken.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(PropertyListing, { foreignKey: 'property_added_by', as: 'properties', onDelete: 'CASCADE' });
PropertyListing.belongsTo(User, { foreignKey: 'property_added_by', as: 'addedBy' });

// country-state associations
State.belongsTo(Country, { foreignKey: "country_id" });
Country.hasMany(State, { foreignKey: "country_id" });

// city-country-state associations
City.belongsTo(State, { foreignKey: "state_id" });
State.hasMany(City, { foreignKey: "state_id" });



// For PropertyStatus
User.hasMany(PropertyStatus, { foreignKey: 'added_by', as: 'statuses', onDelete: 'CASCADE' });
PropertyStatus.belongsTo(User, { foreignKey: 'added_by', as: 'creator' });

// For PropertyCategory
User.hasMany(PropertyCategory, { foreignKey: 'added_by', as: 'categories', onDelete: 'CASCADE' });
PropertyCategory.belongsTo(User, { foreignKey: 'added_by', as: 'creator' });


// Amenity associations
User.hasMany(Amenity, { foreignKey: 'added_by', as: 'amenities', onDelete: 'CASCADE' });
Amenity.belongsTo(User, { foreignKey: 'added_by', as: 'creator' });


// Database connection helper
const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Connected to MySQL database (${DB_NAME}) in ${NODE_ENV} mode`);

    // Sync database in development only (safe)
    if (NODE_ENV === 'development') {
      await sequelize.sync({ alter: false });
    }
  } catch (error) {
    console.error('Error connecting to database: ', error);
    process.exit(1);
  }
};

export default connectToDatabase;
