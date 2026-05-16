const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res, next)=>{
  try{
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ error: 'email and password required' });
    const exist = await User.findOne({ email });
    if(exist) return res.status(400).json({ error: 'User exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash: hash });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    res.json({ user: { id: u._id, email: u.email, name: u.name }, token });
  }catch(err){next(err)}
};

exports.login = async (req, res, next)=>{
  try{
    const { email, password } = req.body;
    const u = await User.findOne({ email });
    if(!u) return res.status(400).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'dev', { expiresIn: '7d' });
    res.json({ user: { id: u._id, email: u.email, name: u.name }, token });
  }catch(err){next(err)}
};
