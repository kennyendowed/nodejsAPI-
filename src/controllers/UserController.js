const fs = require('fs');
const path = require('path');
const db = require("../models");
const nodemailer = require("nodemailer");
const utils = require("./helpers/utils");
const Beneficiary = db.Beneficiary;
const Reservations = db.Reservations;
const Watchlists = db.Watchlists;
const Wallet = db.Wallet;
const Offers = db.Offers;
const Transactions = db.Transactions;
const User = db.user;
const Op = db.Sequelize.Op;

async function userWallet(req, res) {
  var UserId = await req.currentUser.userId;
  try {
    Wallet.findOne({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
    }).then((data) => {
      var Return_data = {
        walletInformation: {
          userID: data.user_id,
          accountType: data.account_type,
          accountName: data.account_name,
          accountnumber: data.account_number,
          availableBalance: data.actual_bal,
          totalBalance: data.lien_bal,
        },
      };

      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: Return_data,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function getuserTransaction(req, res) {
  try {
    Transactions.findAll({
      where: {
        [Op.or]: [{ account_number: req.params.id }],
      },
      attributes: [
        "user_id",
        "narrations",
        "amount",
        "account_number",
        "transactionReference",
        "type",
        "date",
      ],
      include: [
        {
          model: Wallet,
          attributes: ["account_type", "account_name", "account_number"],
          as: "wallets_details",
        },
      ],
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: datas,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function funduserWallet(req, res) {
  try {
    var UserId = await req.currentUser.userId;
    Transactions.findOne({
      where: {
        [Op.or]: [{ transactionReference: req.body.transactionReference }],
      },
    }).then((trans) => {
      if (!trans) {
        Transactions.create({
          narrations: req.body.narrations,
          user_id: UserId,
          amount: req.body.amount,
          account_number: req.params.id,
          transactionReference: req.body.transactionReference,
          type: "credit",
          date: req.body.date,
        });

        Wallet.findOne({
          where: {
            user_id: UserId,
          },
        }).then((user) => {
          user.update({
            actual_bal: parseInt(user.actual_bal) + parseInt(req.body.amount),
            lien_bal: parseInt(user.actual_bal) + parseInt(req.body.amount),
          });
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "Account Fund successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function createOffer(req, res) {
  var OfferId = utils.randomPin(4);
  try {
    let avatar = req.files.picture;

    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    avatar.mv("./assets/uploads/" + avatar.name);

    Offers.upsert({
      offer_id: OfferId,
      title: req.body.title,
      description: req.body.description,
      picture: process.env.APP_ASSETS_URL + "assets/uploads/" + avatar.name,
      available_offer: req.body.available_offer,
      price: req.body.price,
      coupon: utils.randomChar(4, "alnum"),
    });

    return res.status(200).send({
      status: "TRUE",
      data: [
        {
          code: 200,
          data: "Offer saved successfully ",
        },
      ],
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function listOffer(req, res) {
  try {
    // Save User beneficiary to Database
    Offers.findAll({
      where: {
        [Op.or]: [{ is_deleted: "0", status:"0" }],
      },
      attributes: [
        "id",
        "offer_id",
        "title",
        "description",
        "price",
        "picture",
        "available_offer",
        "coupon",
      ],
      order: [
        ['id', 'DESC']
      ]
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Offers  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function listOfferwishlist(req,res){
  try {
    // Save User beneficiary to Database
    Watchlists.findAll({
      where: {
        [Op.or]: [{ is_deleted: "0" }],
      },
      attributes: [
        "id",
        "offer_id",
        "user_id",
      ],
      include: [
        {
          model: Offers,
          attributes: [ "offer_id", "title","description","price","picture","available_offer","coupon"],
       
        },
      ],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Watch lists  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function createReservation(req, res) {
  var UserId = await req.currentUser.userId;
  var name = await req.currentUser.name;
  var email = await req.currentUser.email;
  var reservation_id = utils.randomChar(6, "numeric");
  let dataWallet = await Wallet.findOne({
    where: { [Op.or]: [{ user_id: UserId }] },
  });
  let result = await Offers.findOne({
    where: { [Op.or]: [{ offer_id: req.params.id }] },
  });

  try {
    Reservations.findOne({
      where: {
        [Op.or]: [{ offer_id: req.params.id, user_id: UserId }],
      },
    }).then((result2) => {
      if (result2) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "you already subscribe to this offer.",
            },
          ],
        });
      } else {
        if (parseInt(dataWallet.actual_bal) > parseInt(result.price))  {
          let text =
            " \n\nHello " +
            name +
            ",   \n\n Your request offer has been reserved.  \n\n Reservation Code : " +
            reservation_id +
            "  \n\n ";
          let new_available_offer= parseInt(result.available_offer) - parseInt(1);
          if (new_available_offer === "-1") {
            Offers.findOne({
              where: {
                offer_id: req.params.id,
              },
            }).then((user) => {
              user.update({
                available_offer: new_available_offer,
                status: "1",
              });
            });
           } else {
            Reservations.create({
              offer_id: req.params.id,
              user_id: UserId,
              price:result.price,
              reservation_id: reservation_id,
            });
            Offers.findOne({
              where: {
                offer_id: req.params.id,
              },
            }).then((user) => {
              user.update({
                available_offer: new_available_offer,
                status: "0",
              });
            });

           let new_availableResult =parseInt(dataWallet.actual_bal) - parseInt(result.price);
           // let lien_bal_available = parseInt(dataWallet.lien_bal) + parseInt(result.price);

            dataWallet.update({
              actual_bal: new_availableResult,
              // lien_bal: lien_bal_available,
            });
          }

          utils.sendsEMail(email, name, 'Offer Reservation ', text);
          return res.status(200).send({
            status: "TRUE",
            data: [
              {
                code: 200,
                data: "Offer Reserve Successfully",
              },
            ],
          });
        } else {
          Watchlists.findOne({
            where: {
              [Op.or]: [{ offer_id: req.params.id, user_id: UserId }],
            },
          }).then((resr) => {
            if (resr) {
              return res.status(404).send({
                status: "FALSE",
                data: [
                  {
                    code: 404,
                    message: "you already added to watchlist",
                  },
                ],
              });
            } else {
              Watchlists.create({
                user_id: UserId,
                offer_id: req.params.id,
              });

              return res.status(404).send({
                status: "FALSE",
                data: [
                  {
                    code: 404,
                    message: "Offer Reserve To Watchlist Due Low Balance",
                  },
                ],
              });
            }
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function createWatchlist(req, res){
  var UserId = await req.currentUser.userId;
  var name = await req.currentUser.name;
  var email = await req.currentUser.email;
  var reservation_id = utils.randomChar(6, "numeric");
  let dataWallet = await Wallet.findOne({
    where: { [Op.or]: [{ user_id: UserId }] },
  });
  let result = await Offers.findOne({
    where: { [Op.or]: [{ offer_id: req.params.id }] },
  });

  try {

    if(parseInt(result.available_offer) <= parseInt(0)){
      return res.status(404).send({
        status: "FALSE",
        data: [
          {
            code: 404,
            message: "Offer Unavialable.",
          },
        ],
      });
    }
    else{


    Watchlists.findOne({
      where: {
        [Op.or]: [{ offer_id: req.params.id, user_id: UserId }],
      },
    }).then((resr) => {
      if (resr) {
        if (parseInt(dataWallet.actual_bal) > parseInt(result.price)) {
          let text =
            " \n\nHello " +
            name +
            ",   \n\n Your request offer has been reserved.  \n\n Reservation Code : " +
            reservation_id +
            "  \n\n ";
          let new_available_offer= parseInt(result.available_offer) - parseInt(1);
          if (new_available_offer === "-1") {
            Offers.findOne({
              where: {
                offer_id: req.params.id,
              },
            }).then((user) => {
              user.update({
                available_offer: new_available_offer,
                status: "1",
              });
              return res.status(404).send({
                status: "FALSE",
                data: [
                  {
                    code: 404,
                    message: "Offer Unavialable.",
                  },
                ],
              });
            });
           } else {
            Reservations.create({
              offer_id: req.params.id,
              user_id: UserId,
              price:result.price,
              reservation_id: reservation_id,
            });
            Offers.findOne({
              where: {
                offer_id: req.params.id,
              },
            }).then((user) => {
              user.update({
                available_offer: new_available_offer,
                status: "0",
              });
            });

           let new_availableResult =parseInt(dataWallet.actual_bal) - parseInt(result.price);
           // let lien_bal_available = parseInt(dataWallet.lien_bal) + parseInt(result.price);

            dataWallet.update({
              actual_bal: new_availableResult,
              // lien_bal: lien_bal_available,
            });
          }
          Watchlists.destroy({
            where: {
              [Op.or]: [{ offer_id: req.params.id, user_id: UserId }],
            },
          });
        utils.sendsEMail(email, name, 'Offer Reservation ', text);
          return res.status(200).send({
            status: "TRUE",
            data: [
              {
                code: 200,
                data: "Offer Reserve Successfully",
              },
            ],
          });
        } 
        else{
          return res.status(404).send({
            status: "FALSE",
            data: [
              {
                code: 404,
                message: "Please fund your wallet",
              },
            ],
          });
        }
      } else {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "Watchlists not found.",
            },
          ],
        });
      }
    });
  }
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }

}

async function createbeneficiary(req, res) {
  var UserId = await req.currentUser.userId;
  try {
    // Save User beneficiary to Database
    Beneficiary.findOne({
      where: {
        [Op.or]: [{ number: req.body.number }],
      },
    }).then((result) => {
      if (!result) {
        Beneficiary.create({
          user_id: UserId,
          name: req.body.name,
          number: req.body.number,
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "beneficiary saved successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function getbeneficiary(req, res) {
  var UserId = await req.currentUser.userId;
  try {
    // Save User beneficiary to Database
    Beneficiary.findAll({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
      attributes: ["id", "user_id", "name", "number"],
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "beneficiarys  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: result,
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function deletebeneficiary(req, res) {
  try {
    Beneficiary.destroy({
      where: {
        [Op.or]: [{ id: req.params.id }],
      },
    }).then((result) => {
      if (!result) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "beneficiarys  not found.",
            },
          ],
        });
      }
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: "beneficiarys deleted successfully ",
      });
    });
  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function userUpdate(req, res){
  var email = await req.currentUser.email;
  try {
    User.findOne({
      where: {
        [Op.or]: [{ user_id: req.params.id }],
      },
    }).then((user) => {
      if (!user) {
        return res.status(404).send({
          status: "FALSE",
          data: [
            {
              code: 404,
              message: "User Not found.",
            },
          ],
        });
      }
      let avatar = req.files.avater;
      var dir = "assets/uploads/" + email;
      !fs.existsSync(dir) && fs.mkdirSync(dir, { recursive: true })
    
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      avatar.mv(dir + "/"+ avatar.name);

      user.update({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    gender: req.body.gender,
    dob: req.body.dob,
    username: req.body.username,
    phone:req.body.phone,
    avater:process.env.APP_ASSETS_URL + dir+"/" + avatar.name,
    address:req.body.address,
      });
      return res.status(200).send({
        status: "TRUE",
        data: [
          {
            code: 200,
            data: "Account Updated successfully ",
          },
        ],
      });
    });

  } catch (error) {
    return res.status(500).send({
      status: "FALSE",
      data: [
        {
          code: 500,
          message: "Whoops, looks like something went wrong",
          developerMessage: error.message,
        },
      ],
    });
  }
}

async function userProfile(req, res){
  var UserId = await req.currentUser.userId;
  try {
    User.findOne({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
      attributes: [
        "user_id",
        "first_name",
        "last_name",
        "gender",
        "dob",
        "username",
        "email",
        "phone",
        "address",
        "avater"
      ],
      include: [
        {
          model: Wallet,
          attributes: ["account_type", "account_name", "account_number"],
          as: "UserAccount",
        },
      ],
    }).then((datas) => {
      return res.status(200).send({
        status: "TRUE",
        code: 200,
        data: datas,
      });
    });


} catch (error) {
  return res.status(500).send({
    status: "FALSE",
    data: [
      {
        code: 500,
        message: "Whoops, looks like something went wrong",
        developerMessage: error.message,
      },
    ],
  });
}
}

module.exports = {
  userUpdate,
  userProfile,
  createReservation,
  listOffer,
  deletebeneficiary,
  getbeneficiary,
  userWallet,
  funduserWallet,
  getuserTransaction,
  createOffer,
  createbeneficiary,
  createWatchlist,
  listOfferwishlist
};

// exports.allAccess = (req, res) => {
//   res.status(200).send("Welcome to Api Engine application.");
// };

// exports.userBoard = (req, res) => {
//   res.status(200).send("User Content.");
// };

// exports.adminBoard = (req, res) => {
//   res.status(200).send("Admin Content.");
// };

// exports.staffBoard = (req, res) => {
//   res.status(200).send("Staff Content."+ req.currentUser.user_id+" welcome");
// };

// const User = require("../models/User");

// // Create and Save a new User
// exports.create = (req, res) => {
//    // Validate request
//    if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   // Create a Customer
//   const user = new User({
//     email: req.body.email,
//     name: req.body.name,
//     active: req.body.active
//   });

//   // Save Customer in the database
//   Customer.create(customer, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while creating the Customer."
//       });
//     else res.send(data);
//   });
// };

// // Retrieve all Users from the database.
// exports.findAll = (req, res) => {

// };

// // Find a single User with a UserId
// exports.findOne = (req, res) => {

// };

// // Update a User identified by the UserId in the request
// exports.update = (req, res) => {

// };

// // Delete a User with the specified UserId in the request
// exports.delete = (req, res) => {

// };

// // Delete all Users from the database.
// exports.deleteAll = (req, res) => {

// };
