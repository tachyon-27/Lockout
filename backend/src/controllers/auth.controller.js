import asyncHandler from "../utils/asyncHandler.js";
import { getGithubAcessToken, getGithubUser } from "../utils/auth/githubAuth.js";
import { getOrCreateGoogleUser } from "../utils/auth/googleAuth.js"; 
import { generateToken } from "../utils/token.js";
import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID)

// @desc  Handle Github OAuth Callback
// @route POST /api/auth/github
// @access Public
export const githubCallback = asyncHandler(async (req, res) => {
    try {
        const {code} = req.body;
        console.log('in github callback', code)
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
            console.log("Successfull: ", token)
            return res
              .status(201)
              .cookie("token", token, options)
              .redirect(process.env.FRONTEND_HOME)
          } else {
            res.status(501)
            throw new Error('Error Authenticating Github profile')
          }

    } catch (error) {
        res.status(501)
        throw new Error(error.message)
    }
    
})

// @desc  Validate token and Get/Create user
// @route POST /api/auth/google
// @access Public
export const googleCallback = asyncHandler(async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()

    const { email, name } = payload

    const user = await getOrCreateGoogleUser(email, name);

    if(user && user.isVerified) {
      const token = generateToken(user._id)
  
      const options = {
        httpOnly: true,
        secure: true
      }
      console.log("Successfull: ", token)
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