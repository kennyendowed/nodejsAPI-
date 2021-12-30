
module.exports = (sequelize, Sequelize) => {
  const Watchlists = sequelize.define("Watchlists", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    offer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    is_deleted: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0
    },
  });

  return Watchlists;
};

