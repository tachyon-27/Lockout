import axios from "axios";
import User from "../../models/user.model.js";

export const getGithubAcessToken = async (code) => {
    try {
        const response = await axios.post(
            'https://github.com/login/oauth/access_token',
            new URLSearchParams({
                client_id: process.env.VITE_GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri: process.env.VITE_GITHUB_REDIRECT_URI,
            }),
            {
                headers: {
                    Accept: 'application/json', // Request JSON response
                },
            }
        );

        const { access_token } = response.data;
    
        return access_token;
    } catch (error) {
        throw new Error(error)
    }
}

export const getGithubUser = async (access_token) => {
    try {
        const response = await axios.get('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Accept': 'application/json',
            },
        });

        let { name, email } = response.data;

        if (!email) {
            const emailResponse = await axios.get('https://api.github.com/user/emails', {
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Accept': 'application/json',
                },
            });

            const primaryEmail = emailResponse.data.find(e => e.primary && e.verified);
            if (!primaryEmail) {
                throw new Error('No verified primary email found on GitHub!');
            }
            email = primaryEmail.email;
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            userExists.isVerified = true;
            userExists.githubAccessToken = access_token;

            await userExists.save();
            return userExists;
        }

        const user = await User.create({
            name,
            email,
            isVerified: true,
            githubAccessToken: access_token,
        });

        return user;

    } catch (error) {
        console.error("GitHub Auth Error:", error.response?.data || error.message);
        throw new Error(error.message || "Failed to authenticate with GitHub.");
    }
};