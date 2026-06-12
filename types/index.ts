import type {User, Session} from "next-auth";


export interface CustomUser extends User {
    idToken?: string
    djangoAccess?: string
    djangoRefresh?: string
    role?: 'buyer' | 'seller'
    phone?: string
}

export interface CustomSession extends Session {
    user?: CustomUser | undefined
}