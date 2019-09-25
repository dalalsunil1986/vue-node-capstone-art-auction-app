const userDb = require("../models/userDb");
const xss = require("../helpers/xssFilters");

function verify(token) {
  return new Promise((resolve, reject) => {
    userDb.findByToken(xss(token)).then(user => {
      if (user) {
        return resolve(user);
      }
      return reject();
    });
  });
}

module.exports = verify;
