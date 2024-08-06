const yup = require("yup");

const createLikeschema = yup.object().shape({
  isLike: yup.boolean().required('Is Like is required'),
});

module.exports = {
  createLikeschema,
}
