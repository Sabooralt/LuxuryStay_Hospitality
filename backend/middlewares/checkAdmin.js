const jwt = require('jsonwebtoken');

const checkAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authorization token is missing' });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }
    req.userId = decoded._id;
    next();
  });
};

module.exports = checkAdmin;
