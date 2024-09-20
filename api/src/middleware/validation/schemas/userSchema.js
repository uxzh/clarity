const yup = require("yup");

const updateUserSchema = yup.object().shape({
  username: yup.string().min(5, 'Username must be at least 5 characters').max(50, 'Username must be less than 50 characters'),

  password: yup.string().min(8, 'Password must be at least 8 characters').max(50, 'Password must be less than 50 characters'),
  
  confirmPassword: yup.string().test('Confirm Password', 'Confirm Password is required', (value, context) => {
    if (context.parent.password) return Boolean(value)
    else return true;
  }).min(8, 'Password must be at least 8 characters').max(50, 'Password must be less than 50 characters').test('Confirm Password', 'Passwords must match', (value, context) => {
    return context.parent.password === value;
  }),

  avatar: yup.string().url('Avatar must be a valid URL').max(255, 'Avatar URL must be at most 255 characters'),
});

module.exports = {
  updateUserSchema
};




