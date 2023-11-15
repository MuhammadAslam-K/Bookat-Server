export interface message {
    sender: string
    content: string
    timestamp: string
}

export interface chat {
    rideId: string,
    message: {
        sender: string
        content: string
        timestamp: string
    }
}

export interface signupData {
    name: string,
    email: string,
    mobile: string,
    password: string,
    refrelCode: string
}

export interface userGoogleSignUp {
    name: string,
    email: string,
}

export interface walletDetails {
    date: number,
    details: string,
    amount: number,
    status: string
}