const dbTimeout = require("../models/timeoutDb");
const dbProduct = require("../models/productDb");
const dbUser = require("../models/userDb");
const sendNotification = require("./sendNotification");
const soldDb = require("../models/soldDb");

setInterval(async function() {
  let nowDate = Date.now();
  let timeoutDate = nowDate.toString().slice(0, -3);
  let timeoutCheck;

  try {
    timeoutCheck = await dbTimeout.find();
  } catch (e) {
    console.log(e);
  }

  let fltr = timeoutCheck.filter(x => x.time < timeoutDate);

  if (fltr.length > 0) {
    return fltr.map(x => updateProduct(x));
  }
}, 1000);

async function updateProduct(prd) {
  let product;
  let seller;
  let buyer;
  let sold;

  try {
    await dbTimeout.findOneAndDelete({
      _id: prd._id
    });
    await dbProduct.findOneAndUpdate(
      {
        _id: prd.postId
      },
      {
        $set: {
          active: false
        }
      }
    );
    product = await dbProduct.findOne({
      _id: prd.postId
    });
  } catch (e) {
    console.log(e);
  }

  if (product.bids.length < 1) {
    try {
      seller = await dbUser.findOne({
        _id: product.userId
      });
    } catch (e) {
      console.log(e);
    }

    return sendNotification(
      {
        id: prd.postId
      },
      {
        id: seller._id
      },
      {
        id: false
      },
      product.photos[0]
    );
  }

  let result = product.bids.filter(x => x.bid === product.price);

  try {
    sold = await soldDb.findOne({
      userId: product.userId
    });

    if (!sold) {
      let soldProduct = new soldDb();
      soldProduct.userId = product.userId;
      soldProduct.soldAuctions = [
        {
          title: product.title,
          picture: product.photos[0],
          time: Date.now()
        }
      ];

      soldProduct.save();
    } else {
      await soldDb.findOneAndUpdate(
        {
          userId: product.userId
        },
        {
          $push: {
            soldAuctions: {
              title: product.title,
              picture: product.photos[0],
              time: Date.now()
            }
          }
        }
      );
    }

    seller = await dbUser.findOneAndUpdate(
      {
        _id: product.userId
      },
      {
        $push: {
          reviewTokens: [
            {
              user: String(result[0].userId),
              post: String(product._id)
            }
          ]
        }
      }
    );
    buyer = await dbUser.findOneAndUpdate(
      {
        _id: result[0].userId
      },
      {
        $push: {
          reviewTokens: [
            {
              user: String(seller._id),
              post: String(product._id)
            }
          ]
        }
      }
    );
  } catch (e) {
    console.log(e);
  }

  return sendNotification(
    {
      id: prd.postId
    },
    {
      id: seller._id
    },
    {
      id: buyer._id
    },
    product.photos[0]
  );
}
