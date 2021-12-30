const db = require("../models");
const nodemailer = require("nodemailer");
const utils = require("./helpers/utils");
const sendMail = require("./helpers/mailSend");
const Wallet = db.Wallet;
const Offers = db.Offers;
const Transactions = db.Transactions;
const User = db.user;
const Op = db.Sequelize.Op;


async function userWallet (req, res) {
  var UserId = await req.currentUser.userId;
  try {
    Wallet.findOne({
      where: {
        [Op.or]: [{ user_id: UserId }],
      },
    }) .then((data) => {
         
var Return_data = {
walletInformation : {
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
      attributes:['user_id','narrations','amount','account_number','transactionReference','type','date'],
      include:[
        {
          model:Wallet,attributes:['account_type','account_name','account_number'],         
          as:'wallets_details'

        }
      ]
    }) .then((datas) => {       
     return   res.status(200).send({
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
    })
      .then((trans) => {
        if (!trans) {
           Transactions.create({
            narrations: req.body.narrations,
            user_id: UserId,
            amount: req.body.amount,
            account_number: req.params.id,
            transactionReference: req.body.transactionReference,
            type: 'credit',
            date: req.body.date,
          });

          Wallet.findOne({
            where: {
              user_id: UserId,
            },
          }).then((user) => {
            user.update({
              actual_bal: parseInt(user.actual_bal)+parseInt(req.body.amount),
              lien_bal:parseInt(user.actual_bal)+parseInt(req.body.amount)
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

async function createOffer(req, res){
  var OfferId = utils.randomPin(4);
try{

  let avatar = req.files.picture;
            
  //Use the mv() method to place the file in upload directory (i.e. "uploads")
  avatar.mv('./assets/uploads/' + avatar.name);

  Offers.upsert({
    offer_id: OfferId,
    title:  req.body.title ,
    description: req.body.description,
    picture:  process.env.APP_ASSETS_URL + 'assets/uploads/' + avatar.name,
    available_offer: req.body.available_offer,
    price: req.body.price,
    coupon: utils.randomChar(4,'alnum'),
  })

  
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



module.exports = {
  userWallet,funduserWallet,getuserTransaction,createOffer
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