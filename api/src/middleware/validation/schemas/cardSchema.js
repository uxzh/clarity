const yup = require("yup");

const schema = (isCreate) => yup.object().shape({
  cardName: yup.string().required('Title is required').max(255, 'Title must be no more than 255 characters'),

  linkToApply: yup.string().url('Link to Apply must be a valid URL'),

  bankName: yup.string().required('Bank Name is required').max(255, 'Bank Name must be no more than 255 characters'),

  cardImageUrl: yup.string().url('Card Image URL must be a valid URL').required('Card Image URL is required'),

  cashbackPercentages: yup.object().test('cashbackPercentages', 'Percentage should be a number', (value) => {
    if (!value) return true;
    return Object.values(value).every((v) => typeof v === 'number');
  }),

  perks: yup.array().of(yup.string().max(255, 'Perk must be no more than 255 characters')),

  redemptionOptions: yup.array().of(yup.string().max(255, 'Redemption Option must be no more than 255 characters')),

  fees: yup.array().of(yup.object().shape({
    name: yup.string().max(255, 'Fee name must be no more than 255 characters').required('Fee name is required'),
    value: yup.string().required('Fee value is required'),
  })),

  apr: yup.object().shape({
    range: yup.string(),
    introApr: yup.string(),
  }),

  rewards: yup.array().of(yup.object().shape({
    name: yup.string(),
    value: yup.string(),
  })),

  creditScoreRequired: yup.string().required('Credit Score Required is required'),

  additionalBenefits: yup.array().of(yup.string().max(255, 'Additional Benefit must be no more than 255 characters')),

  reviewFromTheWeb: yup.string().max(2000, 'Review from the web must be no more than 2000 characters'),
});

module.exports = {
  createCardSchema: schema(true),
  updateCardSchema: schema(false),
}
