const postRouter = require('express').Router();
const auth = require('./verifytoken');

postRouter.get('/', auth, (req, res) => {
    res.json({
        message: 'harus login buat aksesnya '
    });
});

module.exports = postRouter;
