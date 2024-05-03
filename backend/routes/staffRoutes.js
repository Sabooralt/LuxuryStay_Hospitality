const express = require('express')

const {loginStaff,signupStaff,getStaff, updateStaffRole, deleteStaff} = require('../controllers/staffController')

const router = express.Router()

router.get('/',getStaff)

//Login
router.post('/login',loginStaff)

//Signup
router.post('/signup',signupStaff);

//update role

router.patch('/update_role/:id',updateStaffRole)
router.delete('/delete/:id',deleteStaff)

module.exports = router