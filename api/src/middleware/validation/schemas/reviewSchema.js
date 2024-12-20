const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  cardId: yup.string().test('cardId', 'Card ID is required', (value) => !isCreate || value),

  rating: yup.number().test('rating', 'Rating is required', (value) => !isCreate || value).min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').integer('Rating must be an integer'),

  title: yup.string().test('title', 'Title is required', (value) => !isCreate || value).max(255, 'Title must be at most 255 characters'),

  content: yup.string().test('content', 'Content is required', (value) => !isCreate || value),

  isHidden: yup.boolean()

});

module.exports = {
  createReviewSchema: schema(true),
  updateReviewSchema: schema(false),
}
