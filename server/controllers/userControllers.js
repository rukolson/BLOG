const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');

const User = require('../models/userModel');
const HttpError = require('../models/errorModel');

const jwtVerify = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new HttpError('Session expired. Please log in again.', 401);
        }
        throw new HttpError('Invalid token.', 403);
    }
};

const generateToken = (payload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 3600 }); // Token ważny przez 1 godzinę
    return token;
};

const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, password2 } = req.body;
        if (!name || !email || !password) {
            return next(new HttpError('Fill in all fields.', 422));
        }

        const newEmail = email.toLowerCase();

        const emailExists = await User.findOne({ email: newEmail });
        if (emailExists) {
            return next(new HttpError('Email already exist', 422));
        }

        if (password.trim().length < 6) {
            return next(new HttpError('Password should be at least 6 characters', 422));
        }

        if (password !== password2) {
            return next(new HttpError('Passwords do not match.', 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        const newUser = await User.create({ name, email: newEmail, password: hashedPass });
        res.status(201).json(`New user ${newUser.email} registered.`);
    } catch (error) {
        return next(new HttpError('User registration failed.', 422));
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new HttpError('Fill in all fields.', 422));
        }

        const newEmail = email.toLowerCase();

        const user = await User.findOne({ email: newEmail });
        if (!user) {
            return next(new HttpError('Invalid Credentials.', 422));
        }

        const comparePass = await bcrypt.compare(password, user.password);
        if (!comparePass) {
            return next(new HttpError('Invalid credentials.', 422));
        }

        const { _id: id, name } = user;
        const token = generateToken({ id, name });

        res.status(200).json({ token, id, name });
    } catch (error) {
        return next(new HttpError('Login failed. Please check your credentials.', 422));
    }
};

const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id).select('-password');
        if (!user) {
            return next(new HttpError('User not found.', 404));
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HttpError(error));
    }
};

const logoutUser = (req, res, next) => {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    res.status(200).json('User Logged out');
};

const changeAvatar = async (req, res, next) => {
    let fileName;

    try {
        if (!req.files || !req.files.avatar) {
            return next(new HttpError('No avatar uploaded', 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found', 404));
        }

        if (user.avatar) {
            fs.unlink(path.join(__dirname, '..', 'uploads', user.avatar), (err) => {
                if (err) {
                    console.log('Error deleting old avatar:', err);
                    return next(new HttpError('Error deleting old avatar', 500));
                }
            });
        }

        const { avatar } = req.files;

        if (avatar.size > 500000) {
            return next(new HttpError('Profile picture too large. Max size is 500KB.', 422));
        }

        fileName = avatar.name;
        const splittedFilename = fileName.split('.');
        const newFilename = splittedFilename[0] + uuid() + '.' + splittedFilename[splittedFilename.length - 1];

        avatar.mv(path.join(__dirname, '..', 'uploads', newFilename), async (err) => {
            if (err) {
                return next(new HttpError('Error saving avatar', 500));
            }

            const updatedAvatar = await User.findByIdAndUpdate(req.user.id, { avatar: newFilename }, { new: true });
            if (!updatedAvatar) {
                return next(new HttpError('Avatar could not be updated', 422));
            }

            res.status(200).json({ avatar: newFilename });
        });
    } catch (error) {
        return next(new HttpError('Error processing the avatar', 500));
    }
};

const editUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

        // Sprawdzamy, czy wymagane pola są obecne
        if (!name || !email) {
            return next(new HttpError('Name and email are required.', 422));
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return next(new HttpError('User not found.', 403));
        }

        // Sprawdzamy, czy e-mail nie jest już w użyciu przez innego użytkownika
        const emailExist = await User.findOne({ email });
        if (emailExist && emailExist._id.toString() !== req.user.id) {
            return next(new HttpError('Email already exists.', 422));
        }

        // Jeśli użytkownik chce zmienić hasło, sprawdzamy, czy podał obecne hasło
        if (newPassword || confirmNewPassword) {
            if (!currentPassword) {
                return next(new HttpError('Current password is required to change password.', 422));
            }

            const validateUserPassword = await bcrypt.compare(currentPassword, user.password);
            if (!validateUserPassword) {
                return next(new HttpError('Invalid current password.', 422));
            }

            if (newPassword !== confirmNewPassword) {
                return next(new HttpError('New passwords do not match.', 422));
            }

            // Walidacja długości nowego hasła
            if (newPassword.length < 6) {
                return next(new HttpError('Password must be at least 6 characters long.', 422));
            }

            const newSalt = await bcrypt.genSalt(10);
            const newHash = await bcrypt.hash(newPassword, newSalt);

            // Aktualizujemy dane użytkownika, w tym nowe hasło
            const updatedUser = await User.findByIdAndUpdate(
                req.user.id, 
                { name, email, password: newHash }, 
                { new: true }
            );
            return res.status(200).json(updatedUser);
        }

        // Jeśli użytkownik nie zmienia hasła, aktualizujemy tylko nazwę i e-mail
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id, 
            { name, email }, 
            { new: true }
        );
        res.status(200).json(updatedUser);

    } catch (error) {
        return next(new HttpError(error));
    }
};

const getAuthors = async (req, res, next) => {
    try {
        const authors = await User.find().select('-password');
        res.json(authors);
    } catch (error) {
        return next(new HttpError(error));
    }
};

module.exports = { registerUser, loginUser, logoutUser, getUser, changeAvatar, editUser, getAuthors };
