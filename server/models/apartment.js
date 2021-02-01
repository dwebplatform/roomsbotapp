'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Apartment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Apartment.init({
    address: DataTypes.STRING,
    price: DataTypes.INTEGER,
    isVip: DataTypes.BOOLEAN,
    roomAmount: DataTypes.INTEGER,
    images: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('images'));
      },
      set: function (value) {
        this.setDataValue('images', JSON.stringify(value));
      },
    }
  }, {
    sequelize,
    modelName: 'Apartment',
  });
  return Apartment;
};