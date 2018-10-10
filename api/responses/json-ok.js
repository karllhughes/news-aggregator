module.exports = function jsonOk(data) {
  return this.res.status(200).json(data);
};
