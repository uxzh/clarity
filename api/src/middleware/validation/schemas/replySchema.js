const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  _id: yup.string().test('id', 'ID is required', (value) => isCreate || value),

  reviewId: yup.string().required('Review ID is required'),

  userId: yup.string().required('User ID is required'),

  content: yup.string().required('Content is required'),

});

module.exports = {
  createReplySchema: schema(true),
  updateReplySchema: schema(false),
}
