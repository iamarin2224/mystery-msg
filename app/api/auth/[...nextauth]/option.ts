import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/users.models";

export const authOptions: NextAuthOptions  = {
    providers: [
        CredentialsProvider({
            //to generate the html form in frontend
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: { label: 'Email or Username', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },

            //method to authorize
            async authorize(credentials: any, req): Promise<any> {
                await dbConnect()

                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],
                    });

                    if (!user){
                        throw new Error("No user found with this email.")
                    }
                    if (!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }

                    const isPassCorrect = await bcrypt.compare(credentials.password, user.password)

                    if (isPassCorrect){
                        //this is our goal to return the user after proper comparing, rest is handled by next auth
                        return user
                    }
                    else{
                        throw new Error("Incorrect Password")
                    }

                } catch (error: any) {
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            //this user is a bsic next auth user not aware of its field so have to over ride in inside next-auth.d.ts inside types

            //making the token more powerful to reduce database calls
            if (user){
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMsg = user.isAcceptingMsg
            }

            if (trigger === "update" && session) {
                token.isAcceptingMsg = session.user.isAcceptingMsg;
            }

            return token
        },
        async session({ session, token }) {
            if (token){
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMsg = token.isAcceptingMsg
            }

            return session
        },
    },
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: '/sign-in' //to declare custom page 
    },
    secret: process.env.NEXTAUTH_SECRET
}