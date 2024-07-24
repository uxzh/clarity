const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  _id: yup.string().test('id', 'ID is required', (value) => isCreate || value),

  cardId: yup.string().required('Card ID is required'),

  rating: yup.number().required('Rating is required').min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').integer('Rating must be an integer'),

  title: yup.string().required('Title is required').max(255, 'Title must be at most 255 characters'),

  content: yup.string().required('Content is required'),

});

module.exports = {
  createReviewSchema: schema(true),
  updateReviewSchema: schema(false),
}
