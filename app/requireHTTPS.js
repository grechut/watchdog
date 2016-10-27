module.exports = (req, res, next) => {
  // For Heroku/nginx specific condition we could add
  // req.get('x-forwarded-proto') !== 'https'
  if (!req.secure && process.env.NODE_ENV !== "development") {
    return res.redirect('https://' + req.get('host') + req.url);
  }
  next();
};
