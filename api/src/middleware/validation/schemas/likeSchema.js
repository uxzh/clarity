const yup = require("yup");

const likeSchema = yup.object().shape({
    isLike: yup.boolean().required('Is Like is required'),
});

module.exports = {
    likeSchema,
}
