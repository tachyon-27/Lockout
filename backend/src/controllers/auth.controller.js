import asyncHandler from "../utils/asyncHandler.js";
import { getGithubAcessToken, getGithubUser } from "../utils/auth/githubAuth.js";
import { generateToken } from "../utils/token.js";

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
            throw new Error('Error Authenticating Github pro')
          }

    } catch (error) {
        res.status(501)
        throw new Error(error.message)
    }
    
})