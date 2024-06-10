const User = require('../model/userModel');
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        console.log(req.body);
    const { username, password } = req.body;
    const userNameCheck = await User.findOne({ username });

    if (userNameCheck) {
        return res.status(400).json({ message: 'Username already exists!', status: false});
    }

    const hackerPwd = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        password: hackerPwd,
    });

    console.log("i have been accessed");

    delete newUser.password;
    return res.status(200).json({ message: 'User created successfully!', newUser, status: true });
} catch (err) {
    next(err);
}
}

module.exports.login = async (req, res, next) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        const userNameCheck = await User.findOne({ username });
    
        if (!userNameCheck) {
            console.log("username doesnt exist");
            return res.status(400).json({ message: 'Username doesnt exist', status: false});
        }

        const pwdCheck = await bcrypt.compare(password, userNameCheck.password);

        if (!pwdCheck) {
            console.log("incorrect password");
            return res.status(400).json({ message: 'Password is incorrect', status: false});
        }
        console.log("i have been accessed 2");

        delete userNameCheck.password;
        return res.status(200).json({ message: 'Login successful', userNameCheck, status: true });
    } catch (err) {
        next(err);
    }
}

module.exports.alluser = async (req, res, next) => {
    try {
        const users = await User.find({ _id: { $ne: req.params.id } }).select([
            "username", "_id"
        ]);
        return res.status(200).json({ message: 'All user', users, status: true });
    } catch (err) {
        next(err);
    }
}

module.exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}).select([
            "username", "_id"
        ]);
        return res.status(200).json({ message: 'All users', users, status: true });
    } catch {
        next(err);
    }
}