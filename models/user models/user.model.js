import { DataTypes } from 'sequelize';

const UserModel = (sequelize) => {
  return sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'Full Name is required' },
        len: { args: [2, 100], msg: 'Full Name must be between 2 and 100 characters' }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: 'User Email is required' },
        isEmail: { msg: 'Please fill a valid email address' },
        isLowercase: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'User Password is required' },
        len: { args: [6, Infinity], msg: 'Password must be at least 6 characters long' }
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: { msg: 'Phone number is required' } }
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'user_roles', key: 'id' }
    }
  }, {
    timestamps: true,
    tableName: 'users',
    hooks: {
      beforeCreate: (user) => {
        if (user.email) user.email = user.email.toLowerCase().trim();
      },
      beforeUpdate: (user) => {
        if (user.email) user.email = user.email.toLowerCase().trim();
      }
    }
  });
};

export default UserModel;
