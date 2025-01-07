import asyncHandler from "../utils/asyncHandler";
import { getGithubAcessToken, getGithubUser } from "../utils/auth/githubAuth";
import { generateToken } from "../utils/token";

// @desc  Handle Github OAuth Callback
// @route POST /api/auth/github
// @access Public
export const githubCallback = asyncHandler(async (req, res) => {
    try {
        const code = req.body;

        const access_token = getGithubAcessToken(code)

        const user = getGithubUser(access_token)

        if(user && user.isVerified) {
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
            throw new Error('Error Authenticating Github pro')
          }

    } catch (error) {
        throw new Error('Error ')
    }
    
})