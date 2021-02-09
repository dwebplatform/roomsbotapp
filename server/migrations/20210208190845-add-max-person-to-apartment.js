module.exports = {
  up: function (queryInterface, Sequelize) {
    // logic for transforming into the new state
    return queryInterface.addColumn(
      'apartments',
      'maxperson',
      {
        type: Sequelize.INTEGER,
        defaultValue: 6
      }
    );
  },
  down: function (queryInterface, Sequelize) {
    // logic for reverting the changes
    return queryInterface.removeColumn(
      'apartments',
      'maxperson'
    );
  }
}