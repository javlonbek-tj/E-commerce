export default async function isAuth(req, res, next) {
  try {
    if (!req.user) {
      return res.redirect('/login');
    }
    next();
  } catch (err) {
    next(err);
  }
}
