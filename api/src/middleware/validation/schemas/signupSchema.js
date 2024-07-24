const yup = require("yup");

const signupSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password', 'Password is required').min(8, 'Password must be at least 8 characters'),
  confirmPassword: yup.string().test('Confirm Password', 'Confirm Password is required', (value, context) => {
    if (context.parent.password) return Boolean(value)
    else return true;
  }).test('Confirm Password', 'Passwords must match', (value, context) => {
    return context.parent.password === value;
  }),
});

module.exports = signupSchema;




