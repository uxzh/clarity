const MAIL_TEMPLATES = {
  confirmEmail: (link) => ({
    subject: 'Confirm your email',
    text: `Click on the link to confirm your email: ${link}`,
    html: `<a href="${link}">Click here to confirm your email</a>`,
  }),
};

module.exports = {
  MAIL_TEMPLATES,
};