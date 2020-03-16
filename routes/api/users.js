const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth')

const User = require('../../models/User')

// @route    GET api/users
// @desc     Register User
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})

router.post('/', [
  // POST request Validation
  check('name', 'Name is required.')
    .not()
    .isEmpty(),
  check('email', 'Please incluse a valid email')
    .isEmail(),
  check('password', 'Please enter a password that is at least 6 characters')
    .isLength({ min: 6 })
], 
async (req, res) => {
  const { name, email, password } = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()})
  }

  try {
    // checks to see if user already exists
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
      // sets user gravatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });
      // creating new user with User model
      user = new User({
        name,
        email,
        avatar,
        password
      });
      
      const salt = await bcrypt.genSalt(10);
      // hashing password
      user.password = await bcrypt.hash(password, salt);
      // saving user to DB
      await user.save();
      // JWT payload for user
      const payload = {
        user: {
          id: user.id
        }
      };

      const secret = config.get('JWT_SECRET')
      // signing and assigning JWT
      JWT.sign(
        payload,
        secret,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
)


module.exports = router