import mongoose, { Document, Model, Schema } from 'mongoose';
import type { PermissionModule } from '@/utils/adminRbac';

export interface IAdminActivityLog extends Document {
  actor: mongoose.Types.ObjectId;
  action: string;
  module: PermissionModule | 'auth';
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const AdminActivityLogSchema = new Schema<IAdminActivityLog>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },
    module: {
      type: String,
      required: true,
      enum: [
        'dashboard',
        'orders',
        'products',
        'customers',
        'analytics',
        'payments',
        'reviews',
        'team',
        'settings',
        'auth',
      ],
      index: true,
    },
    targetType: {
      type: String,
      trim: true,
      default: '',
    },
    targetId: {
      type: String,
      trim: true,
      default: '',
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

AdminActivityLogSchema.index({ createdAt: -1 });
AdminActivityLogSchema.index({ actor: 1, createdAt: -1 });

const AdminActivityLog: Model<IAdminActivityLog> =
  mongoose.models.AdminActivityLog || mongoose.model<IAdminActivityLog>('AdminActivityLog', AdminActivityLogSchema);

export default AdminActivityLog;
