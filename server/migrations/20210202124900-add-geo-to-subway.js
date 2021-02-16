module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'Subways',
      'geo',
      {
        type: Sequelize.STRING,
        defaultValue: '[]'
      }
    );

  },

  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'subways',
      'geo'
    );
  }
}