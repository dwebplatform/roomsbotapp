'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subway extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Subway.init({
    name: DataTypes.STRING,
    geo: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('geo'));
      },
      set: function (value) {
        this.setDataValue('geo', JSON.stringify(value));
      },
    },

  }, {
    sequelize,
    modelName: 'Subway',
  });
  return Subway;
};