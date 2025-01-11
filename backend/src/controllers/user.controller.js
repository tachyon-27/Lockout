import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { resend } from '../utils/resend.js';

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
  let userExists = await User.findOne({email})
  const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
  const expiryDate = new Date()
  expiryDate.setHours(expiryDate.getHours() + 1)

  if(userExists) {
    if(userExists.isVerified) {
      res.status(400)
      throw new Error('User already exists')
    }
    else {
      const hashedPassword = await bcrypt.hash(password, 10)
      userExists.password = hashedPassword
      userExists.name = name
      userExists.verifyCode = verifyCode
      userExists.verifyCodeExpiry = expiryDate
      await userExists.save()
    }
  }
  else {
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: expiryDate
    })
  
    if (!user) {
      res.staus(400)
      throw new Error('Invalid user data')
    }
    userExists = user
  }

  // const emailResponse = await sendVerificationEmail(email, name, verifyCode)

  // if(!emailResponse.success) {
  //   res.status(500)
  //   throw new Error(emailResponse.message)
  // }

  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully. Please verify your email", userExists))
})

// @desc  Login User
// @route POST /api/user/login
// @access Public
export const loginUser = asyncHandler(async (req, res) => {
  try {
    const {email, password} = req.body;
  
    // If any of the fields are missing
    if(!email || !password) {
      res.status(400);
      throw new Error('Please add all fields')
    }
  
    // Check if user exists
    const user = await User.findOne({email});
  
    if(user && user.isVerified && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id)
  
      const options = {
        httpOnly: true,
        secure: true
      }
  
      return res
        .status(201)
        .cookie("token", token, options)
        .json(new ApiResponse(201, "User logged in successfully.", user))
    } else {
      res.status(401)
      throw new Error('Invalid email or password ')
    }
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

// @desc  Logout User
// @route POST /api/user/logout
// @access Public
export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, "User Logged Out"))
})

export const sendEmail = asyncHandler(async (req, res) => {
    try {
      const {email, content} = req.body
    
      if(!email || !content) {
        throw new Error("All fields are required.")
      }
      const { error} = await resend.emails.send({
        from: 'Test <onboarding@resend.dev>',
        to: email,
        subject: 'Verification code',
        html: content
      });

      if(error) {
          return res.json({
              success: false,
              message: error.message
          })
      }

      return res.json({
          success: true,
          message: "Verification email sent successfully to " + email
      })
  } catch(emailError) {
      console.log("Error while sending verification email ", emailError)
      return res.json({
          success: false,
          message: "Failed to send verification email."
      }) 
  }
})