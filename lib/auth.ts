import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Api from "./api"
import { isAxiosError } from "axios"

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

            return { access, refresh, email: profile.user.email, name: profile.user.first_name + ' ' + profile.user.last_name, role: profile.role, phone: profile.phone }
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
  ],

  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }: { session: any, token: any }) {
      session.user = token.user as any

      console.log('user token', token.user)
      console.log("access token", token.user.refresh)

      


      try {
        await Api.post('/token/verify/', { 'token': token.user.access }).catch(async (error) => {
          if (error.response.status === 401) {
            const res = await Api.post('/token/refresh/', { refresh: token.user.refresh })
            if (res.status === 200) {
              session.user.access = res.data.access
              session.user.refresh = res.data.refresh
              // Api.defaults.headers.common['Authorization'] = `Bearer ${res.data.access}`
              // Api.interceptors.request.use((config) => {
              //   config.headers.Authorization = `Token ${res.data.access}`;
              //   return config;
              // })
            }else{
              signOut({ redirectTo: '/' })
            }
          }
        })
      } catch (e) {
        session.user = null
      }

      return session
    },
  },
})