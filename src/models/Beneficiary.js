module.exports = (sequelize, Sequelize) => {
    const Beneficiary = sequelize.define("Beneficiarys", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 0
      },
    });
  
    return Beneficiary;
  };
  
  