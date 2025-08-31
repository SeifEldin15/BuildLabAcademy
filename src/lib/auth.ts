import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

export const generateJWT = (userId: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyJWT = (token: string): { userId: string } | null => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    return null;
  }
};

export const generateVerificationCode = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const generateResetToken = (): string => {
  return uuidv4();
};
