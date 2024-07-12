import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token is required');

  try {
    const decoded = jwt.verify(token.split(' ')[1], 'secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};

export default verifyToken;
