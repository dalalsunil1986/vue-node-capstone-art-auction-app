const productDb = require("../models/productDb");
const xss = require("../helpers/xssFilters");

function filter(city, category, sortBy, tm, page, res) {
  let cty = xss(city);
  let ctg = xss(category);
  let sort = xss(sortBy);
  let time = xss(tm);
  let pg = xss(page);

  if (city && category && sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty,
            category: ctg
          })
          .sort({
            price: sort
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (!city && category && sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        category: ctg
      })
      .then(count => {
        productDb
          .find({
            active: true,
            category: ctg
          })
          .sort({
            price: sort
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (city && !category && sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty
          })
          .sort({
            price: sort
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (city && category && !sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty,
            category: ctg
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (city && !category && !sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (!city && category && !sortBy && !tm) {
    productDb
      .countDocuments({
        active: true,
        category: ctg
      })
      .then(count => {
        productDb
          .find({
            active: true,
            category: ctg
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (!city && !category && sortBy && !tm) {
    productDb
      .countDocuments({
        active: true
      })
      .then(count => {
        productDb
          .find({
            active: true
          })
          .sort({
            price: sort
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  }
  //TIME ADDED
  else if (city && category && time && !sortBy) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty,
            category: ctg
          })
          .sort({
            time: tm
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (!city && category && time && !sortBy) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            category: ctg
          })
          .sort({
            time: tm
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (city && !category && time && !sortBy) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true,
            city: cty
          })
          .sort({
            time: tm
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  } else if (!city && !category && time && !sortBy) {
    productDb
      .countDocuments({
        active: true,
        category: ctg,
        city: cty
      })
      .then(count => {
        productDb
          .find({
            active: true
          })
          .sort({
            time: tm
          })
          .skip(Number(pg))
          .limit(10)
          .then(data => {
            return res.send({
              success: {
                count: count,
                data: data
              }
            });
          });
      });
  }
}

module.exports = filter;
