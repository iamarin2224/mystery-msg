import 'next-auth'

//modifying the existing next-auth module to instruct it about the user interface, and doing same for session and jwt
declare module 'next-auth' {
    interface User {
        _id?: string,
        username?: string
        isVerified?: boolean,
        isAcceptingMsg?: boolean,
    }

    interface Session {
        user: {
            _id?: string,
            username?: string
            isVerified?: boolean,
            isAcceptingMsg?: boolean,
        } & DefaultSession["user"] //to use the user as a key
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        _id?: string,
        username?: string
        isVerified?: boolean,
        isAcceptingMsg?: boolean,
    }
}