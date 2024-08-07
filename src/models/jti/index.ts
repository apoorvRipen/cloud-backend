import { model, Schema } from "mongoose";

const schema = new Schema({
  uid: {
    type: Schema.Types.ObjectId, //USER ID
    required: true,
  },
  jti: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: "LOGIN",
    enum: [ "LOGIN", "PASSWORD" ],
  },
  status: {
    type: String,
    default: "ACTIVE",
    enum: [ "ACTIVE", "REVOKED", "EXPIRED" ],
  },
  jtiExpiry: {
    type: Date,
  },
  notificationToken: {
    type: String,
  },
  deviceType: {
    type: String,
    enum: [ "WEB", "MAC" ],
  },
}, {
  timestamps: true,
});

schema.index({
  uid: 1,
  jti: 1,
  status: 1,
  type: 1,
}, { unique: true });

export const JTI = model("jti", schema);
