const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator');


// @route    GET api/auth
// @desc     Test route
// @access   Public

router.get('/', auth,  async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


// @route POST api/auth
// @desc Authenticate user and get token
// @access Public

router.post('/', [
  // POST request Validation
  check('email', 'Please incluse a valid email')
    .isEmail(),
  check('password', 'Password is required.')
    .exists()
], 
async (req, res) => {
  const { email, password } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }



  try {
    // checks to see if user already exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid credentials.' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if(!isMatch){
        return res
        .status(400)
        .json({ errors: [{ msg: 'Invalid credentials.' }] });    
      }

      // JWT payload for user
      const payload = {
        user: {
          id: user.id
        }
      };

      const secret = config.get('JWT_SECRET')
      // signing and assigning JWT
      jwt.sign(
        payload,
        secret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
      console.log("User: \n",user)

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)

module.exports = router