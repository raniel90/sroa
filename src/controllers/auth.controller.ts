import createError from 'http-errors';
import { User, UserModel } from '../models/user';
import { ClientInfo, RefreshTokenModel } from '../models/refresh-token';
import { comparePasswords, hashPassword } from '../helpers/hash.helper';
import jwt from 'jsonwebtoken';
import uuid from 'uuid';
import { addMinutes } from 'date-fns';
import { Role } from '../models/role';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

const createToken = (user: any) => {
  return jwt.sign(user, process.env['JWT_SECRET'], {
    expiresIn: process.env['TOKEN_EXPIRES_IN'],
  });
};

export const login = async (email: string, password: string) => {
  if (!email || !password) {
    throw createError(400, 'Email and password are required');
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw createError(404, 'User not found by email');
  }

  if (user.isLocked && user.lockUntil && user.lockUntil > new Date()) {
    throw createError(
      403,
      `Your account has been temporarily locked due to multiple unsuccessful login attempts. Please wait ${LOCKOUT_DURATION_MINUTES} minutes before trying again.`
    );
  }

  if (user.passwordResetRequired) {
    throw createError(
      403,
      'Password reset is required. Please reset your password to continue.'
    );
  }

  

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

    if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
      user.isLocked = true;
      user.lockUntil = addMinutes(new Date(), LOCKOUT_DURATION_MINUTES);
      user.passwordResetRequired = true;
    }

    user.updatedAt = new Date();

    await user.save();
    throw createError(401, 'Invalid password');
  }

  user.failedLoginAttempts = 0;
  user.isLocked = false;
  user.lockUntil = null;
  user.updatedAt = new Date();
  await user.save();

  const token = createToken({
    id: user._id,
    email: user.email,
    role: user.role,
  });

  return { token };
};


export const refreshToken = async (refreshToken: string) => {
  // Not be implemented now

};

export const register = async (user: User) => {
  try {
    if (!user.email || !user.password || !user.name || !user.role) {
      throw createError(400, 'Missing required fields');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      throw createError(400, 'Invalid email format');
    }
    if (user.dob) {
      const dob = new Date(user.dob);
      if (isNaN(dob.getTime())) {
        throw createError(400, 'Invalid date of birth');
      }
      const ageDiffMs = Date.now() - dob.getTime();
      const ageDate = new Date(ageDiffMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 18) {
        throw createError(400, 'User must be at least 18 years old');
      }
    }

    if (!Object.values(Role).includes(user.role)) {
      throw createError(400, 'Invalid role');
    }

    const existingUser = await UserModel.getByEmail(user.email);
    if (existingUser) {
      throw createError(409, 'Email already in use');
    }

    const hashedPassword = await hashPassword(user.password);

    const newUser = await UserModel.add({
      ...user,
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });

    const userToReturn = newUser.toObject();

    delete userToReturn.password;

    return userToReturn;
  } catch (error) {
    throw error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const existingUser = await UserModel.getByEmail(email);
    if (!existingUser) {
      throw createError(403, 'There was a problem. User does not exist');
    }
    const now = new Date();
    const passwordResetTokenExpires = addMinutes(now, 10);
    const passwordResetToken = uuid.v4();
    await existingUser.updateOne({
      passwordResetTokenExpires,
      passwordResetToken,
      failedLoginAttempts: 0,
      isLocked: false,
      lockUntil: null,
      passwordResetRequired: false,
      updatedAt: now
    });
    console.log('reset token:', passwordResetToken);
    console.log('reset token:', email);

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const resetPassword = async (email: string, password: string, token: string) => {
  try {
    const user = await UserModel.getByEmail(email);
    if (!user) {
      throw createError(403, 'There was a problem reseting your password. User does not exist');
    }
    if (user.passwordResetToken !== token) {
      throw createError(403, 'There was a problem reseting your password. Invalid Token');
    }
    if (user.passwordResetTokenExpires < new Date()) {
      throw createError(403, 'There was a problem reseting your password. Token expired');
    }
    const hashedPassword = hashPassword(password);
    await user.updateOne({ password: hashedPassword });
    return { success: true };
  } catch (error) {
    throw error;
  }
};
