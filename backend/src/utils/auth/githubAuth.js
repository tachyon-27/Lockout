import axios from "axios";
import User from "../../models/user.model";
import { loginUser } from "../../controllers/user.controller";
import { generateToken } from "../token";

export const getGithubAcessToken = async (code) => {
    const response = await axios.post('https://github.com/login/oauth/access_token', new URLSearchParams({
        client_id: process.env.VITE_GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.VITE_GITHUB_REDIRECT_URI,
    }))
    
    const { access_token } = response.data;

    return access_token;
}

export const getGithubUser = async (access_token) => {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': 'application/json',
            },
        })

        const {name, email} = response.data

        const userExists = User.findOne({email})

        if(userExists) {

            userExists.githubAccessToken = access_token;

            await userExists.save();

            return userExists
        }

        const user = await User.create({
            name,
            email,
            isVerified: true,
            githubAccessToken: access_token,
        })

        if (user) {
            return user
        }

    } catch (error) {
        throw new Error(error)
    }


}