import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

const hashPassword = async (rawPassword: string) => new Promise((resolve, reject) => {
  hash(rawPassword, 10)
    .then(resolve)
    .catch(reject);
});

const matchPassword = async (raw: string, encrypted: string) => new Promise((resolve, reject) => {
  compare(raw, encrypted)
    .then(resolve)
    .catch(reject);
});

const assignToken = (payload: any, secret: string): string => {
  return sign(payload, secret, {
    audience: 'cloud.com',
    issuer: 'Cloud',
    expiresIn: '24 days'
  });
};

export { hashPassword, matchPassword, assignToken };
