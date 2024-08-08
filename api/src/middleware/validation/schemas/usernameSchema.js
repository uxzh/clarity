const yup = require("yup");

const usernameSchema = yup.object().shape({
  username: yup.string().required('Username is required').min(5, 'Username must be at least 5 characters').max(50, 'Username must be less than 50 characters')
});

module.exports = {
  usernameSchema
};




