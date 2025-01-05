const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileAvatar: { type: String, default: '' }, // Add the profile image field
});

// Hash the password before saving the user
userSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(12, (err, salt) => {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

// Method to compare the password
userSchema.methods.comparePassword = function (userPassword) {
    const user = this;
    return new Promise((resolve, reject) => {
        bcrypt.compare(userPassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }
            if (!isMatch) {
                return reject(false);
            }
            resolve(true);
        });
    });
};

// Check if the model is already defined, and only define it if it's not
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
