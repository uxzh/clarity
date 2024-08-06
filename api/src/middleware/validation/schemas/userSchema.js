const yup = require("yup");

const updateUserSchema = yup.object().shape({
  _id: yup.string().test('id', 'ID is required', (value) => isCreate || value),
  
  username: yup.string().required('Username is required').min(5, 'Username must be at least 5 characters').max(50, 'Username must be less than 50 characters'),
});

module.exports = updateUserSchema;




