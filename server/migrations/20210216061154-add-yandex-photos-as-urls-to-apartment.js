'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
      return queryInterface.addColumn(
      'apartments',
      'yandexPhotos',
      {
        type: Sequelize.STRING,
        defaultValue: '[]'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'apartments',
      'yandexPhotos'
    );
  }
};
