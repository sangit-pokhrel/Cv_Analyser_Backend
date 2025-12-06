const { validationResult } = require('express-validator');
const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
   
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const payload = {
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      role: req.body.role || 'job_seeker'
    };

    const data = await authService.registerUser(payload);

    return res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { email, password } = req.body;
    const data = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };
