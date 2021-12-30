
module.exports = (sequelize, Sequelize) => {
  const Offers = sequelize.define("offers", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    offer_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    picture: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    available_offer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    price: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    coupon: {
      type: Sequelize.STRING,
      allowNull: true,
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

  return Offers;
};

