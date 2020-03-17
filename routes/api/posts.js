const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const User = require('../../models/User')
const Post = require('../../models/Post')
const Profile = require('../../models/Profile')


// @route    GET api/posts/
// @desc     Get All Posts
// @access   Private

router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1})
    res.json(posts)
  } catch (error) {
    console.error(error.message)
    res.status(500).send('Server Error')
  }
})


// @route    POST api/posts
// @desc     Makes a new Post
// @access   Private

router.post('/', 
  [
    auth, 
    [
      check('text', 'Post body is required.').not().isEmpty()
    ]
  ] ,
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array()})
    }


    try {
      // get user by id
      const user = await User.findById(req.user.id).select('-password')

      //  Build new Post object
      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      })

      // save post to database 
      const post = await newPost.save()
      res.json(post)

    } catch (error) {
      console.error(error)
      res.status(500).send('Server Error')
    }
  }
)


// @route    GET api/posts/:post_id
// @desc     Get post by id
// @access   Private

router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)

    if(!post){
      return res.status(404).json({ message: "Post not found."})
    }

    res.json(post)
  } catch (error) {
    console.error(error.message)
    if(error.kind === 'ObjectId'){
      return res.status(404).json({ message: "Post not found."})
    }
    res.status(500).send('Server Error')
  }
})


// @route    DELETE api/posts/:post_id
// @desc     Delete a post by ID
// @access   Public

router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id)
    
    if(!post){
      return res.status(404).json({ message: "Post not found."})
    }

    // Check and validate user
    if(post.user.toString() !== (req.user.id)){
      return res.status(401).json({ message: 'User not authorized'})
    }

    await post.remove()

    res.json({ 
      message: 'post removed',
      removedPost: post
    })
  } catch (error) {
    console.error(error.message)
    if(error.kind === 'ObjectId'){
      return res.status(404).json({ message: "Post not found."})
    }
    res.status(500).send('Server Error')
  }
})


// @route    PUT api/posts/like/:post_id
// @desc     Like a post
// @access   Private

router.put('/like/:post_id',
  auth,
  async (req, res) => {
    try {
      // get post
      const post = await Post.findById(req.params.post_id)

      // check if psdt has already been liked
      if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
        return res.status(400).json({ message: 'Post already liked' })
      }

      post.likes.unshift({ user: req.user.id })
      // save post to db with new like
      await post.save()
      console.log('Post liked.')
      res.json(post.likes)

    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
})


// @route    PUT api/posts/like/:post_id
// @desc     Unike a post
// @access   Private

router.put('/unlike/:post_id',
  auth,
  async (req, res) => {
    try {
      // get post
      const post = await Post.findById(req.params.post_id)

      // check if psdt has already been liked
      if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
        return res.status(400).json({ message: 'Post has not been liked' })
      }

      // get remove index
      const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id)
      // save post to db with new like
      post.likes.splice(removeIndex, 1)

      await post.save()
      console.log('Post liked.')
      res.json(post.likes)

    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error')
    }
})

// @route    PUT api/posts/comments/:post_id
// @desc     Post new comment to a specific post
// @access   Private

router.put('/comments/:post_id',
  auth, 
  [
    check('text', 'Comment text is required.').not().isEmpty()
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password')
      const post = await Post.findById(req.params.post_id)
      

      const newComment = {
        text: req.body.text,
        user: req.user.id,
        avatar: user.avatar,
        name: user.name
      }

      post.comments.unshift(newComment)
      await post.save()

      res.json(post.comments)
    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error.')
    }
  })


// @route    PUT api/posts/comments/:post_id/:comment_id
// @desc     Delete a comment by comment and post id
// @access   Public

router.delete('/comments/:post_id/:comment_id',
  auth,   
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.post_id)
      // grab comment from post
      const comment = post.comments.find(comment => comment.id === req.params.comment_id)

      if(!comment) {
        return res.status(404).json({ message: 'Comment not found.' })
      }

      // check if user and comment user match
      if(comment.user.toString() !== req.user.id){
        return res.status(401).json({ message: 'User not authorized' })
      }

      const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id)
      // save post to db with new like
      post.comments.splice(removeIndex, 1)

      await post.save()

      res.json(post.comments)

    } catch (error) {
      console.error(error.message)
      res.status(500).send('Server Error.')
    }
})



// @route    DELETE api/posts/:post_id/comments/:comment_id
// @desc     Test route
// @access   Public

router.delete('/', (req, res) => res.send('Posts Route'))

module.exports = router