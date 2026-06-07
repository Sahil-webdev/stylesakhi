import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IAdminSettings extends Document {
  user: mongoose.Types.ObjectId;
  profile: {
    firstName: string;
    lastName: string;
    name: string;
    email: string;
    phone: string;
  };
  notifications: {
    emailNotifs: boolean;
    pushNotifs: boolean;
  };
  security: {
    twoFactorEnabled: boolean;
  };
  store: {
    publicStore: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminSettingsSchema = new Schema<IAdminSettings>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    profile: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      name: { type: String, default: '' },
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
    },
    notifications: {
      emailNotifs: { type: Boolean, default: true },
      pushNotifs: { type: Boolean, default: false },
    },
    security: {
      twoFactorEnabled: { type: Boolean, default: false },
    },
    store: {
      publicStore: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  },
);

const AdminSettings: Model<IAdminSettings> =
  mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);

export default AdminSettings;
