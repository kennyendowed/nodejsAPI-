
module.exports = (sequelize, Sequelize) => {
  const Wallet = sequelize.define("wallets", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    account_type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    account_name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    account_number: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    actual_bal: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lien_bal: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 0
    },
  });

  return Wallet;
};

