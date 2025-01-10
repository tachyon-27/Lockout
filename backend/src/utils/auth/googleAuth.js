import User from "../../models/user.model";

export const getOrCreateGoogleUser = async (email, name) => {
    try {
        const userExists = User.findOne({email})
    
        if(userExists) {

            await userExists.save();
    
            return userExists

        }
    
        const user = await User.create({
            name,
            email,
            isVerified: true,
            isGoogle: true,
        })
    
        if (user) {
            return user
        }
        
    } catch (error) {
        throw new Error(error)
    }
}