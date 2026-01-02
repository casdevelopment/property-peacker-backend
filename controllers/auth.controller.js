import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { sequelize } from '../database/sequelize.js';

import { User } from '../database/sequelize.js';
import { Otp } from '../database/sequelize.js';
import { PasswordResetToken } from '../database/sequelize.js';
import transporter from '../config/nodemailer.js';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/env.js'
import { renderTemplate } from '../utils/email-render.js';
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const generateResetToken = () => crypto.randomBytes(32).toString('hex');

export const signUp = async (req, res, next) => {
  const transaction = await sequelize.transaction();

  try {
    const { fullName, email, password, phone } = req.body;

    // Check if a user already exists
    const existingUser = await User.findOne({
      where: { email: email.toLowerCase().trim() },
      transaction
    });
    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters long');
      error.statusCode = 400;
      throw error;
    };
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      roleId: 1,
    }, { transaction });


    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await Otp.create({
      userId: newUser.id,
      code: otpCode,
      expiresAt,
      used: false
    }, { transaction });
    const html = renderTemplate('otp-email', {
      OTP_CODE: otpCode,
      fullName: newUser.fullName,
      verifyUrl: `http://localhost:5173/verify/${otpCode}`
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: newUser.email,
      subject: 'Your Verification Code',

      html: html

      ,
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    await transaction.commit();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        token,
        user: newUser,
      }
    })
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid password');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.status(200).json({
      success: true,
      message: 'User signed in successfully',
      data: {
        token,
        user,
      }
    });
  } catch (error) {
    next(error);
  }
}

export const signOut = async (req, res, next) => { }

export const verifyOtp = async (req, res, next) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const otp = await Otp.findOne({
      where: {
        userId: user.id,
        code,
        used: false
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otp) {
      const error = new Error('Invalid or already used OTP');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > otp.expiresAt) {
      const error = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    otp.used = true;
    await otp.save();

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    });
  } catch (error) {
    next(error);
  }
}

export const forgotPassword = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() }, transaction });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // invalidate previous unused tokens
    await PasswordResetToken.update(
      { used: true },
      { where: { userId: user.id, used: false }, transaction }
    );

    await PasswordResetToken.create({
      userId: user.id,
      token,
      expiresAt,
      used: false
    }, { transaction });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password reset',
      text: `Use this token to reset your password: ${token}\nIt will expire in 15 minutes.`,
    });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Password reset token sent to your email',
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}

export const resetPassword = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { email, token, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      const error = new Error('Passwords do not match');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findOne({ where: { email: email.toLowerCase().trim() }, transaction });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const resetToken = await PasswordResetToken.findOne({
      where: { userId: user.id, token, used: false },
      order: [['createdAt', 'DESC']],
      transaction
    });

    if (!resetToken) {
      const error = new Error('Invalid or already used token');
      error.statusCode = 400;
      throw error;
    }

    if (new Date() > resetToken.expiresAt) {
      const error = new Error('Token has expired');
      error.statusCode = 400;
      throw error;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    resetToken.used = true;
    await resetToken.save({ transaction });

    user.password = hashedPassword;
    await user.save({ transaction });

    await transaction.commit();

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
}