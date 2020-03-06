const express = require('express')
const auth = require('../../middleware/auth')
const router = express.Router()
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route    GET api/profile/me
// @desc     Get Current User's Profile route
// @access   Private

router.get('/me', auth, async (req, res) => {

  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar'])

    if(!profile){
      return res.status(400).json({ message: "There is no profile for this user" })
    }

    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500)
    res.send('Server Error')
  }
})

module.exports = router