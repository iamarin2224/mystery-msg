import mongoose, {Schema, Document, mongo} from "mongoose";

//As message will be a mongoose document so we inherit it
export interface Message extends Document{
    content: string,
    createdAt: Date
}

//Defining the schema by mentioning type as a custom schema
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

//Define the stucture of User
export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    verifyCodeExpiry: Date,
    isVerified: boolean,
    isAcceptingMsg: boolean,
    messages: Message[] //Stores the array of messagesd sent to the user
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username required"],  //can pass error message
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email required"],
        unique: true,
        match: [
            /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            "Please enter a valid email"
        ] //email validation check (accept 'regex-errorMsg' pair as an array)
    },
    password: {
        type: String,
        required: [true, "Password required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify Code required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMsg: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema] //array of schemas
})

//NextJs is edge timmed so data may or may not be present initially so have to check whil eexporting
// (if present early use this) || (creating for first time same as in express)
const UserModel = (mongoose.models.user as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel