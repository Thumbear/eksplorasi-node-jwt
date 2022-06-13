const authRouter = require('express').Router();
const User = require('../model/user');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
const jwt = require('jsonwebtoken');

authRouter.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    await User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.status(400).send('Invalid email or password');
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) return res.status(400).send(err);
                if (result) {
                    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
                    res.header('auth-token', token).send(token);
                } else {
                    res.status(400).send('Invalid email or password');
                }
            });
        })
        .catch(err => {
            res.status(400).send(err);
        }
    );

})

authRouter.post('/register', async (req, res) => {

    // validate the data
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);


    // check if user already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) return res.status(400).send('Email already exists');

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    
    const user = new User(req.body);
    user.password = hashedPassword;
    console.log(req.body);
    try {
        const saveUser = await user.save();
        res.send(saveUser);
    }
    catch (err) {
        res.status(400).send(err);
    }
    
})


module.exports = authRouter;