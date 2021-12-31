
module.exports = (sequelize, Sequelize) => {
  const Reservations = sequelize.define("Reservations", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    offer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    reservation_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0
    },
    is_deleted: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0
    },
  });

  return Reservations;
};

