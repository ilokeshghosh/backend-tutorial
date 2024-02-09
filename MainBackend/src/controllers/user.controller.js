import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from 'jsonwebtoken'

const generateAccessAndRefreshTokens = async (id) => {
    try {
        const user = await User.findById(id)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        console.log('accesstoken', accessToken)
        console.log('refreshToken', refreshToken)

        user.refreshToken = refreshToken

        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Error while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // ! steps to register user

    //      1.take user credentials from user by using post method in this route : 'http://localhost:8000/api/v1/users/register'
    //      2. validation - not empty
    //      3. check if user already exists : username, email
    //      4. check for images, check for avatar
    //      5. upload them to cloudinary
    //      6. create user object - create entry in db
    //      7. remove password and refresh token field from response
    //      8. check for user creation
    //      9. return response


    const { fullName, email, username, password } = req.body;

    // if(fullName === ''){
    //     throw new ApiError(400, "Full Name is Required")
    // }

    if ([fullName, email, username, password].some((field) => field?.trim() === '')) {
        throw new ApiError(400, "All Fields are required")
    }


    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if (existedUser) {
        throw new ApiError(409, 'User with email or user name already existed');
    }


    const avatarLocalPath = req.files?.avatar[0]?.path;

    // const coverLocalPath = req.files?.coverImage[0]?.path;

    let coverLocalPath;

    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverLocalPath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    // console.log(" cover?.url ?? ''", cover?.url ?? '')
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const cover = await uploadOnCloudinary(coverLocalPath);

    if (!avatar) {
        throw new ApiError(400, 'Avatar file is required');
    }


    const user = await User.create({
        fullname: fullName,
        avatar: avatar.url,
        coverImage: cover?.url ?? '',
        email,
        password,
        userName: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something Went Wrong While Registering User")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    // todo
    /*
    1. get login credentials from user
    2. validate the user data
    5. find the user
    4. check whether password is correct or not 
    5.generate the access and refresh token
    6. send cookies
    
    */

    const { email, username, password } = req.body

    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{ email }, { username }]
    })

    if (!user) {
        throw new ApiError(404, "user is not registered")
    }

    const passwordCheck = await user.isPasswordCorrect(password)
    if (!passwordCheck) {
        throw new ApiError(401, "Password Is Incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select('-password -refreshToken');

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser, accessToken, refreshToken
        }, "User Logged In SuccessFully"))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id,
        {
            $set: { refreshToken: undefined }
        }, {
        new: true
    }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, {}, "User Logged Out"))

})


const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(401, 'Invalid Refresh Token')
        }

        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, 'Refresh Token is expired or used')
        }

        const options = {
            httpOnly: true,
            secure: true
        }

        const { accessToken, refreshToken } = generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    'Access Token Refreshed'

                )
            )
    } catch (error) {
        throw new ApiError(401, error?.message || 'Invalid Access Token')
    }

})

export { registerUser, loginUser, logoutUser, refreshAccessToken }