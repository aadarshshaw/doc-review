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
            // @ts-ignore
            image: profile.picture,
          });
          newUser
            .save()
            .then((user: any) => {
              return true;
            })
            .catch((err: any) => {
              return false;
            });
        }
      });
      return true;
    },
  },
};

export default NextAuth(authOptions);
