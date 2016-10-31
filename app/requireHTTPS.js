module.exports = (req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https' && req.app.get('env') !== 'development') {
    return res.redirect(`https://${req.get('host')}${req.url}`);
  }

  return next();
};
