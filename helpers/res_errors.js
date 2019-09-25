function error(res, message) {
  return res.send({
    success: false,
    message: message
  });
}

module.exports = error;
