module.exports = (error, req, res, next) => {
  req.flash('error', error.errorMessage || 'Something went wrang');
  res.redirect('/records');
  next(error);
};
