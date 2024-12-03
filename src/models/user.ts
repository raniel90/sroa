import { prop, getModelForClass, ReturnModelType, plugin, DocumentType } from '@typegoose/typegoose';
import { PaginateModel, PaginateOptions, PaginateResult } from 'mongoose-paginate-v2';
import paginate from 'mongoose-paginate-v2';

@plugin(paginate)
export class User {
  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ required: true })
  name: string;

  @prop()
  dob?: Date;

  @prop({ required: true })
  role: string;

  @prop()
  passwordResetToken?: string;

  @prop()
  passwordResetTokenExpires?: Date;

  @prop({ default: 0 })
  failedLoginAttempts: number;

  @prop({ default: false })
  isLocked: boolean;

  @prop()
  lockUntil?: Date;

  @prop({ default: false })
  passwordResetRequired: boolean;

  static async getByEmail(this: ReturnModelType<typeof User>, email: string) {
    return this.findOne({ email });
  }

  static async getById(this: ReturnModelType<typeof User>, id: string) {
    return this.findById(id);
  }

  static async add(
    this: ReturnModelType<typeof User>,
    user: Partial<User>
  ) {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  static async deleteUser(this: ReturnModelType<typeof User>, email: string) {
    return this.deleteOne({ email });
  }

  static async getUsers(
    this: ReturnModelType<typeof User> & PaginateModel<User>,
    query: object = {},
    options: PaginateOptions = {}
  ): Promise<PaginateResult<User>> {
    return this.paginate(query, options);
  }

  static async deleteById(this: ReturnModelType<typeof User>, id: string) {
    return this.deleteOne({ _id: id });
  }

  static async updateUser(
    this: ReturnModelType<typeof User>,
    userId: string,
    payload: Partial<User>
  ): Promise<DocumentType<User> | null> {
    return this.findByIdAndUpdate(userId, payload, {
      new: true,
      runValidators: true,
    });
  }
}

const DefaultTransform = {
  schemaOptions: {
    collection: 'users',
    toJSON: {
      virtuals: true,
      getters: true,
      // versionKey: false,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      getters: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        return ret;
      },
    },
  },
};

export const UserModel = getModelForClass(User, DefaultTransform);
