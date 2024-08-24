var express = require('express');
const { registerUser, loginUser, userDetails } = require('../controllers/authController');
const {  authenticatedUser } = require('../middlewares/authenticateUser');
var router = express.Router();



router.post('/register',registerUser);
router.post('/login',loginUser);
router.get('/profile',authenticatedUser, userDetails)

module.exports = router;
