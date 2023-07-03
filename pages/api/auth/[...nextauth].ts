import User from "@/models/user";
import dbConnect from "@/utils/dbConnect";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],

  callbacks: {
    async redirect({}) {
      return "/";
    },

    async signIn({ profile }) {
      if (!profile?.email) {
        return false;
      }
      await dbConnect();
      User.findOne({ email: profile.email as string }).then((user) => {
        if (!user) {
          const newUser = new User({
            name: profile.name,
            email: profile.email,
            image: profile.picture,
          });
          newUser
            .save()
            .then((user: any) => {
              console.log("New user created: ", user);
              return true;
            })
            .catch((err: any) => {
              console.log("Error creating new user: ", err);
              return false;
            });
        }
      });
      return true;
    },
  },
};

export default NextAuth(authOptions);
