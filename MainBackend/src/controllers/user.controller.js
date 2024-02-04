import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from '../utils/ApiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

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
    console.log('FullName is : ', fullName)

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

    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
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
        fullname:fullName,
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

export { registerUser }