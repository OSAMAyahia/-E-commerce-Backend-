const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { validate } = require('./categoryModel');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
        type: String,
        validate: validator.isEmail,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    profileImg: String,

    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
        },
        confirmation_password: {
            type: String, required: [true, 'confirmation_password is required'],
            validate: {
                validator: function (e) {
                    return e===this.password}, message: 'password are not the same'
        }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
        },
    passwordChangeAt: Date,
    passwordresetExpires: Date,
    passwordResetToken: String,
    active:{ type: 'boolean', default: true}
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')){return next()};
    this.password = await bcrypt.hash(this.password, 12)
    this.confirmation_password = undefined;
    next()

})
userSchema.pre(/^find/, async function (next) {
   this.find({active:{$ne: false}})
    next()

})
userSchema.methods.comparepass=( async function(pass,passC) {
   return await bcrypt.compare(pass,passC)

})
userSchema.methods.generateCode= function() {
  const rondaomToken = crypto.randomBytes(32).toString('hex')
  this.passwordResetToken = crypto.createHash('sha256').update(rondaomToken).digest('hex')
  this.passwordresetExpires=Date.now()+10*60*1000
  return rondaomToken

}
// userSchema.pre('findOneAndUpdate', async function(next) {
//     const up = this.getUpdate()
//     if (up.password) {
//         up.password = await bcrypt.hash(up.password, 12)
//         up.confirmation_password = undefined;
//         next()
//     }
// });


const User = mongoose.model('User', userSchema);

module.exports = User;