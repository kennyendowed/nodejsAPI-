
module.exports = (sequelize, Sequelize) => {
    const Blacklist_Token = sequelize.define("Blacklist_Token", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
     });
  
    return Blacklist_Token;
  };
  




