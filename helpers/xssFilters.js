const xssFilters = require("xss-filters");

function filter(data) {
  return xssFilters.inHTMLData(data);
}

module.exports = filter;
