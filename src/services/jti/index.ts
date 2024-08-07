import { JTI } from "../../models";
import { v4 as uuid } from 'uuid';

export const addJti = (data: object) =>
  new Promise((resolve, reject) => {
    JTI.create(data)
      .then(resolve)
      .catch(reject);
  });

export const editJti = (search: {}, update = {}, options = {}) =>
  new Promise((resolve, reject) => {

    JTI.findOneAndUpdate(search, update, options)
      .then(resolve)
      .catch(reject);
  });

export const editJtis = (search: object, update = {}, options = {}) =>
  new Promise((resolve, reject) => {

    JTI.updateMany(search, update, options)
      .then(resolve)
      .catch(reject);
  });

export const getJti = (search: {}, projection?: object, options = {}) =>
  new Promise((resolve, reject) => {
    JTI.findOne(search, projection, options)
      .then(resolve)
      .catch(reject);
  });

export const getJtis = (search: object, projection: object, options = {}) =>
  new Promise((resolve, reject) => {

    JTI.find(search, projection, options)
      .then(resolve)
      .catch(reject);
  });

  // generate jti and its expiry date
export const generateJTI = () => {
  const jti = uuid();

  const todayDate = new Date();
  const expiry = new Date(todayDate.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days in milliseconds
  const jtiExpiry = new Date(expiry).toISOString();

  return [ jti, jtiExpiry ];
};
