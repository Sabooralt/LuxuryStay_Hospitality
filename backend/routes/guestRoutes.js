const express = require('express')

const {loginguest,signupguest,getGuests} = require('../controllers/guestController')

const router = express.Router()

router.get('/',getGuests)

//Login
router.post('/login',loginguest)

//Signup
router.post('/signup',signupguest)

module.exports = router