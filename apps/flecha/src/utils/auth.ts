import bcrypt from 'bcrypt';
import { jwtVerify, SignJWT } from 'jose'; 


export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};


export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};


export const generateToken = async (userId: any): Promise<any> => {
  const payload = { userId };
  const secret = process.env.AUTH_SECRET;
  const expiresIn = '1d';

  const token = await signJWT(payload, secret, expiresIn);
  return token;
}

export const signJWT = async (payload: any, secret: any, expiresIn: string): Promise<string> => {
  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secretKey);

  return token;
}


export const verifyToken = async (token: string): Promise<any> => {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not defined');
  }

  const encoder = new TextEncoder();
  const secretKey = encoder.encode(secret);

  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};