
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
     name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email_code: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email_time: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    email_verify: {
      type: Sequelize.BIGINT,
      allowNull: true,
      defaultValue:0
    },
    resetPasswordToken: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resetPasswordExpires:{
      type: Sequelize.DATE,
      allowNull: true,
    },
  });

  return User;
};





// constructor
// const User = function(user) {
//     this.email = user.email;
//     this.name = user.name;
//     this.active = user.active;
//   };


//   User.create = (newUser, result) => {
//     sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
//       if (err) {
//          console.log("error: ", err);
//         err.json({
//             message:"error: "+ err,
//         });
//       }
  
//       console.log("created user: ", { id: res.insertId, ...newUser });
//       result(null, { id: res.insertId, ...newUser });
//     });
//   };
  
//   User.findById = (customerId, result) => {
//     sql.query(`SELECT * FROM users WHERE id = ${customerId}`, (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(err, null);
//         return;
//       }
  
//       if (res.length) {
//         console.log("found customer: ", res[0]);
//         result(null, res[0]);
//         return;
//       }
  
//       // not found Customer with the id
//       result({ kind: "not_found" }, null);
//     });
//   };
  
//   User.getAll = result => {
//     sql.query("SELECT * FROM users", (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }
  
//       console.log("users: ", res);
//       result(null, res);
//     });
//   };
  
//   User.updateById = (id, customer, result) => {
//     sql.query(
//       "UPDATE users SET email = ?, name = ?, active = ? WHERE id = ?",
//       [User.email, User.name, User.active, id],
//       (err, res) => {
//         if (err) {
//           console.log("error: ", err);
//           result(null, err);
//           return;
//         }
  
//         if (res.affectedRows == 0) {
//           // not found Customer with the id
//           result({ kind: "not_found" }, null);
//           return;
//         }
  
//         console.log("updated customer: ", { id: id, ...customer });
//         result(null, { id: id, ...customer });
//       }
//     );
//   };
  
//   User.remove = (id, result) => {
//     sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }
  
//       if (res.affectedRows == 0) {
//         // not found Customer with the id
//         result({ kind: "not_found" }, null);
//         return;
//       }
  
//       console.log("deleted customer with id: ", id);
//       result(null, res);
//     });
//   };
  
//   User.removeAll = result => {
//     sql.query("DELETE FROM users", (err, res) => {
//       if (err) {
//         console.log("error: ", err);
//         result(null, err);
//         return;
//       }
  
//       console.log(`deleted ${res.affectedRows} users`);
//       result(null, res);
//     });
//   };
  
  //module.exports = User;