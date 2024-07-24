const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  _id: yup.string().test('id', 'ID is required', (value) => isCreate || value),

  cardId: yup.string().required('Card ID is required'),

  userId: yup.string().required('User ID is required'),

  rating: yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),

  content: yup.string().required('Content is required'),

});

module.exports = {
  createReviewSchema: schema(true),
  updateReviewSchema: schema(false),
}
