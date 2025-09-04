const express = require('express');
const upload = require("../middlewares/upload")
const router = express.Router();
const { getAllUsers, getUserWithTasks,getMyProfile ,uploadProfile} = require('../contolelrs/userController');
const auth = require('../middlewares/auth');

// Protected: only logged-in users can see user list
router.get('/', auth, getAllUsers);  // all users
router.get('/me', auth, getMyProfile);          // logged-in user + tasks
router.get('/:id', auth, getUserWithTasks);   // specific user + tasks
router.post('/:id/profile-pic',upload.single("profilePic"),uploadProfile);   // specific user + tasks

module.exports = router;