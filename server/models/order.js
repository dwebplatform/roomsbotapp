'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Order.init({
    status: DataTypes.INTEGER,
    fullInfo: {
      type: DataTypes.STRING,
      get: function () {
        return JSON.parse(this.getDataValue('fullInfo'));
      },
      set: function (value) {
        this.setDataValue('fullInfo', JSON.stringify(value));
      },
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};