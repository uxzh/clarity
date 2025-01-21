const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  cardId: yup.string().test('cardId', 'Card ID is required', (value) => !isCreate || value),

  rating: yup.number().test('rating', 'Rating is required', (value) => !isCreate || value).min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').test('integer or half', 'Rating must be an integer or half', (value) => !isCreate || value % 0.5 === 0),

  title: yup.string().test('title', 'Title is required', (value) => !isCreate || value).max(255, 'Title must be at most 255 characters'),

  content: yup.string().test('content', 'Content is required', (value) => !isCreate || value),

  isHidden: yup.boolean(),

  isAdminReview: yup.boolean(),

  username: yup.string().when('isAdminReview', {
    is: true,
    then: () => yup.string().required('Username is required'),
    otherwise: () => yup.string().notRequired()
  }),
});

module.exports = {
  createReviewSchema: schema(true),
  updateReviewSchema: schema(false),
}
