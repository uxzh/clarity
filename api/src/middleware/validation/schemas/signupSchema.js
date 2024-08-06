const yup = require("yup");

const signupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),

  username: yup.string().required('Username is required').min(5, 'Username must be at least 5 characters').max(50, 'Username must be less than 50 characters'),

  password: yup.string().required('Password', 'Password is required').min(8, 'Password must be at least 8 characters').max(50, 'Password must be less than 50 characters'),
  
  confirmPassword: yup.string().test('Confirm Password', 'Confirm Password is required', (value, context) => {
    if (context.parent.password) return Boolean(value)
    else return true;
  }).min(8, 'Password must be at least 8 characters').max(50, 'Password must be less than 50 characters').test('Confirm Password', 'Passwords must match', (value, context) => {
    return context.parent.password === value;
  }),
});

module.exports = signupSchema;




