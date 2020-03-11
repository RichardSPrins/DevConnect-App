const express = require('express')
const auth = require('../../middleware/auth')
const router = express.Router()
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')
let mongoose = require('mongoose')


// @route    GET api/profile/me
// @desc     Get Current User's Profile route
// @access   Private

router.get('/me',
  auth,
  async (req, res) => {

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
  }
)


// @route    POST api/profile
// @desc     Create a user Profile
// @access   Private

router.post('/', 
  [ auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty()
    ] 
  ], 
  async (req, res) => {

    const errors = validationResult(req)
    
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubUsername,
      skills,
      youtube,
      facebook,
      twitter,
      linkedIn,
      instagram
    } = req.body


    // Build Profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubUsername) profileFields.githubUsername = githubUsername
    if(skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim())
    }

    // build social object

    profileFields.social = {}
    // if(profileFields.social) console.log('empty')
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(twitter) profileFields.social.twitter = twitter
    if(linkedIn) profileFields.social.linkedIn = linkedIn
    if(instagram) profileFields.social.instagram = instagram

    try {
      // Using upsert option (creates new doc if no match is found):
      let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
      );
      res.json(profile)

    } catch (error) {
      console.error({ message: error.message})
      return res.status(500).send('Server Error.')
    }
  }
)


// @route    GET api/profile
// @desc     Get All Profiles route
// @access   Public

router.get('/',
  async (req, res) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar'])
      res.json(profiles)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error.')
    }
  }
)

// @route    GET api/profile/user/user_id
// @desc     Get  profile by user_id
// @access   Public

router.get('/user/:user_id',
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

      if(!profile){
        return res.status(400).json({ message: 'Profile not found!'})
      }

      res.json(profile)
    } catch (err) {
      console.error(err.message)
      if(err.kind == 'ObjectId') {
        return res.status(400).json({ message: 'Profile not found!'})
      }
      res.status(500).send('Server Error.')
    }
  }
)


// @route    DELETE api/profile/
// @desc     Delete profile, user, and posts
// @access   Private

router.delete('/',
  auth,
  async (req, res) => {
    try {
      // TODO: Remove user posts

      // Remove Profile
      await Profile.findOneAndRemove({ user: req.user.id })
      // Remove User
      await User.findOneAndRemove({ _id: req.user.id })

      res.json({ message: 'User Successfully Deleted' })
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error.')
    }
  }
)


// @route    PUT api/profile/experience
// @desc     Edits user profile to add Experience
// @access   Private

router.put('/experience',
  [auth, 
  [
    check('title', 'Title ins required.').not().isEmpty(),
    check('company', 'Company ins required.').not().isEmpty(),
    check('from', 'Starting date is required.').not().isEmpty()
  ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }

    const { title, company, location, from, to, current, description} = req.body

    const newExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()
      res.json(profile)
      
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Server Error")
    }
  }
)


// @route    PUT api/profile/education
// @desc     Edits user profile to add Experience
// @access   Private

router.put('/experience',
  [auth, 
  [
    check('title', 'Title ins required.').not().isEmpty(),
    check('company', 'Company ins required.').not().isEmpty(),
    check('from', 'Starting date is required.').not().isEmpty()
  ]
  ],
  async (req, res) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()){
      return res.status(400).json({errors: errors.array()})
    }

    const { title, company, location, from, to, current, description} = req.body

    const newExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })

      profile.experience.unshift(newExp)

      await profile.save()
      res.json(profile)
      
    } catch (error) {
      console.error(error.message)
      res.status(500).send("Server Error")
    }
  }
)

module.exports = router