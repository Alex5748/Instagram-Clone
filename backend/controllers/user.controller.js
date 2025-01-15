
import { User } from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import getDataUri from "../utils/dataurl.js";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js"
import { Post } from "../models/post.model.js";





export const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing. Please Check!",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: 'User with this email already exist!',
                success: false
            })
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username, email, password: hashedPassword
        });

        return res.status(201).json({
            message: "Account Created Successfully",
            success: true,
        })
        
    } catch (error) {
        console.log(error)
        
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "Something is missing. Please Check!",
                success: false
            })
        };
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Incorrect email or password",
                success: false
            })
            
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(401).json({
                message: "Incorrect email or password!",
                success: false
            });
            
        };

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });

        //populate each post if in the post array
        const populatedPosts = await Promise.all(user.posts.map( async(postId) => {
            const post = await Post.findById(postId);

            if (post.author.equals(user._id)) {
                return post;
            }
            return null;
}))


        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts:populatedPosts
        }

        
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user
        })
        
    } catch (error) {
        console.log(error)
        
    }
}


export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'logout Successfully',
            success: true
        })
        
    } catch (error) {
        console.log(error)
        
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;

        let user = await User.findById(userId).select("-password");
        return res.status(200).json({
            user,
            succcess: true
        });
        
    } catch (error) {
        console.log(error)
        
    }
};


export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        console.log(profilePicture)
        let cloudResponse;
        //console.log(userId);

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
           // console.log(cloudResponse)
            //console.log(`file uri is: ${fileUri}`)
            console.log(`cloudresponse is:${cloudResponse}`)
        }



        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success:false
            })
        }

        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;
        console.log(cloudResponse.secure_url)

        await user.save();

        return res.status(200).json({
            message: "Profile Updated.",
            success: true,
            user
        })

        
    } catch (error) {
        console.log(error)
        
    }
}


export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message:'Currently donot have any users'
            })
        }

        return res.status(200).json({
            success:true,
            users: suggestedUsers
        })
        
    } catch (error) {
        console.log(error)
        
    }
}

export const followOrUnfollow =  async (req, res) => {
    try {
        const followgarne = req.id;
        console.log(` follow garne manxe${followgarne}`)
        const jaslaiFollowgarne = req.params.id;
        console.log(`jaslai ho follow garne${jaslaiFollowgarne}`)

        if(followgarne === jaslaiFollowgarne) {
            return res.status(400).json({
                message: "You cannot follow to yourself",
                success: false

            });

        };

        const user = await User.findById(followgarne);
        const targetUser = await User.findById(jaslaiFollowgarne);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false

            });
            
        }


        // check to follow or unfollow


        const isFollowing = user.following.includes(jaslaiFollowgarne);

        if (isFollowing) {

            //unfollow logic

            await Promise.all([
                User.updateOne({_id:followgarne}, { $pull: { following: jaslaiFollowgarne } }),
                User.updateOne({_id:jaslaiFollowgarne}, {$pull:{followers:followgarne}}),
            ])
            return res.status(200).json({
                message: "unfollowed Successsfully",
                success:true
            })
            
        } else {

           // follow logic
            await Promise.all([
                User.updateOne({_id:followgarne}, { $push: { following: jaslaiFollowgarne } }),
                User.updateOne({_id:jaslaiFollowgarne}, {$push:{followers:followgarne}}),
            ])

            return res.status(200).json({
                message: "Followed Successsfully",
                success:true
            })
        }



        
    } catch (error) {
        
    }
    
}



