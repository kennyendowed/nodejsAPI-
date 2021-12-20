
module.exports = (sequelize, Sequelize) => {
    const User_Login = sequelize.define("User_Login", {
        id: {
			type: Sequelize.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id: {
			type: Sequelize.STRING,
			// type: Sequelize.UUID,
			allowNull: false
		},
		logged_out: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		logged_in_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		logged_out_at: {
			type: Sequelize.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		ip_address: {
			type: Sequelize.TEXT,
			allowNull: true
		},
		token_id: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		token_secret: {
			type: Sequelize.STRING(255),
			allowNull: true
		},
		token_deleted: {
			type: Sequelize.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		device: {
			type: Sequelize.TEXT,
			allowNull: true
		}
    },{
        indexes: [
          { fields: ['user_id', 'token_id'], unique: true }
        ]
          }, {
            tableName: 'User_Login'
        });
  
    return User_Login;
  };
  