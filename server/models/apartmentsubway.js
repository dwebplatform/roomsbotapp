'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ApartmentSubway extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ApartmentSubway.init({
    apartmentId: DataTypes.INTEGER,
    subwayId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ApartmentSubway',
  });
  return ApartmentSubway;
};