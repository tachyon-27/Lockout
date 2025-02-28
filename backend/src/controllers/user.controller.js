import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/token.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { resend } from '../utils/resend.js';
import { getGithubAcessToken, getGithubUser } from "../utils/auth/githubAuth.js";
import { getOrCreateGoogleUser, fetchUserInfo } from "../utils/auth/googleAuth.js";
import { OAuth2Client } from 'google-auth-library';

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

  const token = generateToken(userExists._id, '1h')

  return res
    .status(201)
    .json(new ApiResponse(201, "User Registered Successfully. Please verify your email", userExists))
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

export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { otp, _id } = req.body;
    const user = await User.findById(_id)

    if (!user) {
      res.status(401)
      throw new Error("Unauthorized request")
    }

    if (user.isVerified) {
      res.status(401)
      throw new Error("User already verified")
    }

    if (!otp) {
      res.status(401)
      throw new Error("OTP is required")
    }

    if (otp != user.verifyCode) {
      return res
        .json(new ApiResponse(401, "Incorrect OTP!"))
    }

    if (Date.now() > user.verifyCodeExpiry) {
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
    ).select("-password")

    const options = {
      httpOnly: true,
      secure: true
    }

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
    const {  _id } = req.body;
    const user = await User.findById(_id)

    if (!user) {
      res.status(401)
      throw new Error("Unauthorized request")
    }

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()
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
    ).select("-password")

    return res
      .status(201)
      .json(new ApiResponse(201, "OTP is reset.", newUser))
  } catch (error) {
    res.status(501)
    throw new Error(error.message)
  }
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
    
    if(!user) {
      res.json(new ApiResponse(404, "User not found!"))
    }
    if(!user.password) {
      res.json(new ApiResponse(401, "Password not set!"))
    }
    
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
      return res.json(new ApiResponse(401, 'Invalid email or password '))
    }
  } catch (error) {
    res.status(401)
    throw new Error(error)
  }
})

export const getUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    if(!email) {
      throw new Error("Email is required!")
    }

    const user = await User.findOne({email})
    if(!user || !user.isVerified) {
      return res.jso(new ApiResponse(401, "User does not exist!"))
    }

    return res
      .status(201)
      .json(new ApiResponse(201, "User found.", user))
  } catch (error) {
    return res.json(new ApiResponse(501, error.message || "Error while fetching user", error))
  }
})

export const passwordOTP = asyncHandler(async (req, res) => {
  try {
    const { otp, _id } = req.body;
    const user = await User.findById(_id)

    if(!otp) {
      throw new Error("All fields are required!")
    }

    if(!user || !user.isVerified) {
      throw new Error("User does not exist!")
    }

    if(user.verifyCode != otp) {
      return res.json(new ApiResponse(401, "Incorrect OTP!"))
    }

    if(Date.now() > user.verifyCodeExpiry) {
      return res.json(new ApiResponse(401, "OTP is expired, request a new OTP."))
    }

    user.canChangePassword = true;
    await user.save();

    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          verifyCode: 1,
        }
      },
      {
        new: true
      }
    ).select("-password")

    return res
      .status(201)
      .json(new ApiResponse(201, "User authenticated successfully.", newUser))
  } catch (error) {
    return res.json(new ApiResponse(501, "Error while verifying OTP", error))
  }
})

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { password, _id } = req.body;
    const user = req.user || await User.findById(_id)

    if(  !password) {
      throw new Error("All fields are required!")
    }

    if(!user || !user.isVerified) {
      throw new Error("User does not exist!")
    }

    if(!user.canChangePassword) {
      throw new Error("User not authenticated!")
    }
    
    if(Date.now() > user.verifyCodeExpiry) {
      return res.json(new ApiResponse(401, "Session timed out, user re-authentication required."))
    }

    user.password = await bcrypt.hash(password, 10)
    await user.save()
    
    const newUser = await User.findByIdAndUpdate(
      user._id,
      {
        $unset: {
          canChangePassword: 1,
          verifyCodeExpiry: 1
        }
      },
      {
        new: true
      }
    ).select("-password")
  
    return res
      .status(201)
      .json(new ApiResponse(201, "Password reset successfull.", newUser))
  } catch(error) {
    return res.json(new ApiResponse(501, "Error while resetting password", error))
  }
})

// @desc  Handle Github OAuth Callback
// @route POST /api/auth/github
// @access Public
export const githubCallback = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    console.log(code)
    if (!code) {
      throw new Error('Github OAuth code not found!')
    }

    const access_token = await getGithubAcessToken(code)
    const user = await getGithubUser(access_token)

    if (user && user.isVerified) {
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
        .json(new ApiResponse(201,'User Github Logged in!',user))
    } else {
      res.status(501)
      throw new Error('Error Authenticating Github profile')
    }

  } catch (error) {
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

    if (user && user.isVerified) {
      const token = generateToken(user._id)

      const options = {
        httpOnly: true,
        secure: true,
      }
      return res
        .cookie("token", token, options)
        .status(201)
        .json(new ApiResponse(201, "Google User logged in successfully.", user))
    } else {
      res.status(501)
      throw new Error('Error Authenticating Google profile')
    }
  } catch (error) {
    throw new Error(error);
  }
})

export const refresh = asyncHandler(async (req, res) => {
  try {
    let token = req.cookies?.token

    if(token) {
      return res
        .status(200)
        .json(new ApiResponse(200, "Refresh not required!"));
    }

    const { _id } = req.body;

    if(!_id) {
      throw new Error("id is required!")
    }
    
    const user = await User.findById(_id)
    if(!user || !user.isVerified) {
      return res.jso(new ApiResponse(401, "User does not exist!"))
    }
    
    token = generateToken(_id)

    const options = {
      httpOnly: true,
      secure: true
    }

    return res
      .status(201)
      .cookie("token", token, options)
      .json(new ApiResponse(201, "User token refreshed."))
  } catch {
    return res
      .status(400)
      .json(new ApiResponse(401, "Error while refreshing"))
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

export const getCFIDs = asyncHandler(async (req, res) => {
  return res
    .status(201)
    .json(new ApiResponse(201, "", {cfids: req.user.codeforcesID.filter(cfid => cfid.isVerified)}))
})

export const getUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({isVerified: true}, 'name email isAdmin'); 
        
    return res
      .status(201)
      .json(new ApiResponse(201, "Successfully fetched all users", users))
  } catch(error) {
    return res.json(new ApiResponse(501, "Error while getting users", error))
  }
})

export const editName = asyncHandler(async (req, res) => {
  try {
    const { name } = req.body;

    if(!name) {
      throw new Error("Name is required.")
    }

    req.user.name = name;
    await req.user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, "Name updated Successfully.", req.user))
  } catch(error) {
    throw new Error(error)
  }
})

export const removeCFID = asyncHandler(async (req, res) => {
    try {
      const { cfid } = req.body; 
      const user = req.user;
  
      const updatedCodeforcesIDs = user.codeforcesID.filter(entry => entry.cfid !== cfid);
  
      if (updatedCodeforcesIDs.length === user.codeforcesID.length) {
        throw new Error("CFID not found!")
      }
  
      user.codeforcesID = updatedCodeforcesIDs;
      await user.save();
  
      return res
        .status(201)
        .json(new ApiResponse(201, "Codeforces ID removed."))
    } catch (error) {
      throw new Error(error)
    }
});

export const getLoggedinUser = asyncHandler(async (req, res) => {
  return res
    .json(new ApiResponse(201, "User fetched.", req.user))
})
