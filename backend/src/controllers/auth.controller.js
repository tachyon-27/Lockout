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

        res.json({
            user,
            token: generateToken(user._id),
        })

    } catch (error) {
        throw new Error('Error ')
    }
    
})