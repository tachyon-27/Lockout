import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getGithubAcessToken, getGithubUser } from "../utils/auth/githubAuth.js";
import { getOrCreateGoogleUser, fetchUserInfo } from "../utils/auth/googleAuth.js"; 
import { generateToken } from "../utils/token.js";
import { OAuth2Client } from 'google-auth-library';

// @desc  Handle Github OAuth Callback
// @route POST /api/auth/github
// @access Public
export const githubCallback = asyncHandler(async (req, res) => {
    try {
        const {code} = req.body;
        if(!code) {
            throw new Error('Github OAuth code not found!')
        }

        const access_token = await getGithubAcessToken(code)
        const user = await getGithubUser(access_token)

        if(user && user.isVerified) {
            const token = generateToken(user._id)
        
            const options = {
              httpOnly: true,
              secure: true
            }

            res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
            res.setHeader('Access-Control-Allow-Credentials', 'true');

            return res
              .status(201)
              .cookie("token", token, options)
              .json(new ApiResponse('User Github Logged in!'))
          } else {
            res.status(501)
            throw new Error('Error Authenticating Github profile')
          }

    } catch (error) {
        res.status(501)
        throw new Error(error.message)
    }

  })

export const verifyEmail = asyncHandler(async (req, res)=> {
  try {
    const {_id, otp} = req.body;

    const user = await User.findById(_id);

    if(!user) {
      res.status(401)
      throw new Error("Unauthorized request")
    }

    if(user.isVerified) {
      res.status(401)
      throw new Error("User already verified")
    }

    if(!otp) {
      res.status(401)
      throw new Error("OTP is required")
    }

    if(otp != user.verifyCode) {
      return res
        .json(new ApiResponse(401, "Incorrect OTP!"))
    }

    if(Date.now() > user.verifyCodeExpiry) {
      return res
        .json(new ApiResponse(401, "OTP is expired! Resend the OTP."))
    }

    user.isVerified = true;
    await user.save();

    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          verifyCode: 1,
          verifyCodeExpiry: 1
        }
      },
      {
        new: true
      }
    )

    return res
      .status(201)
      .json(new ApiResponse(201, "User verified successfully", newUser))
  } catch (error) {
    res.status(501)
    throw new Error(error.message)
  }
})

export const resetOTP = asyncHandler(async (req, res) => {
  try {
    const {_id} = req.body;
    const user = await User.findById(_id);

    if(!user) {
      res.status(401)
      throw new Error("Unauthorized request")
    }

    if(user.isVerified) {
      res.status(401)
      throw new Error("User already verified")
    }

    const verifyCode = Math.floor(100000 + Math.random()*900000).toString()
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours() + 1)

    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          verifyCode: verifyCode,
          verifyCodeExpiry: expiryDate
        }
      },
      {
        new: true
      }
    )

    return res
      .status(201)
      .json(new ApiResponse(201, "OTP is reset.", newUser))
  } catch(error) {
    res.status(501)
    throw new Error(error.message)
  }
})

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID)

// @desc  Validate token and Get/Create user
// @route POST /api/auth/google
// @access Public
export const googleCallback = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const userInfo = await fetchUserInfo(token)

    const { email, name } = userInfo

    const user = await getOrCreateGoogleUser(email, name);

    if(user && user.isVerified) {
      const token = generateToken(user._id)
  
      const options = {
        httpOnly: true,
        secure: true
      }
      .log("Successfull: ", token)
      return res
        .status(201)
        .cookie("token", token, options)
        .json(new ApiResponse(201, "Google User logged in successfully.", user))
      } else {
        res.status(501)
        throw new Error('Error Authenticating Google profile')
      }

  } catch (error) {
    throw new Error(error);
  }
})
