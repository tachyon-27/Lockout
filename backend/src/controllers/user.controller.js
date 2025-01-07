import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc  Register new User
// @route POST /api/user/register
// @access Public
export const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  // If any of the fields are missing
  if(!name || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({email})
  if(userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create new user
  const user = await User.create({
    name,
    email,
    password: hashedPassword
  })

  // Create token
  if (user) {
    const token = generateToken(user._id)
    res.json({
      user,
      token
    })
  } else {
    res.staus(400)
    throw new Error('Invalid user data')
  }
})

// @desc  Login User
// @route POST /api/user/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  // If any of the fields are missing
  if(!email || !password) {
    res.status(400);
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const user = await User.findOne({email});

  if(user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      user,
      token: generateToken(user._id)
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
  
})