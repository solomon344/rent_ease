import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import Api from "./api"
import { isAxiosError } from "axios"
import { image } from "@heroui/theme"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          label: "Password",
          placeholder: "*****",
        },

      },
      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied
        try {
          const response = await Api.post("/token/", { email: credentials?.email, password: credentials?.password })
          const data = response.data
          console.log(data)
          if (data) {
            // Any object returned will be saved in `user` property of the JWT
            const { access, refresh, profile } = data
            // Api.defaults.headers.common['Authorization'] = `Bearer ${access}`

            // Api.interceptors.request.use((config) => {
            //   config.headers.Authorization = `Token ${access}`;
            //   return config;
            // })
            console.log("user image", profile.picture)
            console.log("profile", profile)
            return { djangoAccess: access, djangoRefresh: refresh, email: profile.user.email, name: profile.user.first_name + ' ' + profile.user.last_name, role: profile.role, phone: profile.phone, image: profile.picture}
          } else {
            // If you return null here then auth.js will default to a bad request response
            return null
          }
        } catch (e) {
          if (isAxiosError(e)) {
            throw new Error(e.response?.data?.message)
          } else {
            throw new Error("Something went wrong. Please try again.")
          }
        }
      },
    })
    ,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: "openid email profile" } },
    
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.user = user
      }

      if (account) {
        const currentUser = (token.user || {}) as Record<string, any>
        const idToken = (account as any).id_token
        if (account.provider === 'google' && idToken) {
          try {
            const djangoUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
            const res = await fetch(`${djangoUrl}/auth/google/`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id_token: idToken }),
            })
            const data = await res.json().catch(() => null)
            if (res.ok && data?.access) {
              token.user = {
                ...currentUser,
                image: data?.user?.image,
                idToken,
                accessToken: account.access_token,
                djangoAccess: data.access,
                djangoRefresh: data.refresh,
                djangoUser: data.user,
                role: data?.user?.role,
                phone: data?.user?.phone,
              }
            } else {
              token.user = {
                ...currentUser,
                idToken,
                googleError: data?.message || 'Unable to verify Google token',
              }
            }
          } catch (e) {
            token.user = {
              ...currentUser,
              idToken,
              googleError: 'Google verification request failed',
            }
          }
        } else {
          if (account.access_token) token.user = { ...currentUser, accessToken: account.access_token }
          else if (idToken) token.user = { ...currentUser, idToken }
          
        }
      }

      // console.log("from jwt",token)
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user = token.user as any
      session.user.djangoAccess = token.user?.djangoAccess || token.user?.access
      session.user.djangoRefresh = token.user?.djangoRefresh || token.user?.refresh
      session.user.googleError = token.user?.googleError

      // expose idToken/accessToken to client session for backend verification
      try {
        session.user.idToken = session.user.idToken || token.user?.idToken || token.user?.id_token
        session.user.accessToken = session.user.accessToken || token.user?.accessToken || token.user?.access_token
      } catch (e) {
        // ignore
      }

      


      const verifyToken = token.user?.access || token.user?.djangoAccess
      const refreshToken = token.user?.refresh || token.user?.djangoRefresh

      try {
        if (verifyToken) {
          await Api.post('/token/verify/', { token: verifyToken }).catch(async (error) => {
            if (error.response?.status === 401 && refreshToken) {
              const res = await Api.post('/token/refresh/', { refresh: refreshToken })
              if (res.status === 200) {
                session.user.djangoAccess = res.data.access
                session.user.djangoRefresh = res.data.refresh
              } else {
                session.user = null
              }
            }
          })
        }
      } catch (e) {
        session.user = null
      }

      console.log(session.user)

      return session
    },
  },
})