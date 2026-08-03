const { User } = require('../models');
const { signAccessToken, signRefreshToken } = require('../utils/tokens');
const jwt = require('jsonwebtoken');

async function register(req, res) {
  const { name, username, phone, email, password } = req.body;

  if (!name || !username || !phone || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters.' });
  }

  const existing = await User.findOne({
    where: { [require('sequelize').Op.or]: [{ email }, { username }] },
  });
  if (existing) {
    return res.status(409).json({ message: 'Username or email already in use.' });
  }

  const user = await User.create({ name, username, phone, email, passwordHash: password });

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.status(201).json({ user: user.toSafeJSON(), accessToken, refreshToken });
}

async function login(req, res) {
  const { identifier, password } = req.body; // identifier = username or email

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Username/email and password are required.' });
  }

  const user = await User.findOne({
    where: { [require('sequelize').Op.or]: [{ email: identifier }, { username: identifier }] },
  });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  res.json({ user: user.toSafeJSON(), accessToken, refreshToken });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ message: 'Refresh token required.' });

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findByPk(payload.sub);
    if (!user) return res.status(401).json({ message: 'User no longer exists.' });

    const accessToken = signAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired refresh token.' });
  }
}

async function me(req, res) {
  res.json({ user: req.user.toSafeJSON() });
}

module.exports = { register, login, refresh, me };
