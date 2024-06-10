const router = require('express').Router();
const {register, login, alluser, getAllUsers} = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get("/getalluser", getAllUsers);
router.get("/allusers/:id", alluser);

module.exports = router;