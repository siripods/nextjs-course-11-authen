import NextAuth from "next-auth/next";
//import { Provider } from "next-auth/react";
import { connectToDatabae } from "../../../lib/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from '../../../lib/auth';

//the exported handler function is created by NextAuth, by calling NextAuth()
//paramter to configure NextAuth's behavior
export default NextAuth({
  session: {
    jwt: true,
  },
  providers: [
    CredentialsProvider({
      // name: "Credentials",
      // credentials: {
      //   email: { label: "Email", type: "text", placeholder: "jsmith" },
      //   password: { label: "Password", type: "password" }
      // },
      async authorize(credentials, req) {
        //console.log("inside authorize");
        console.log("find existing user", credentials.email);
        console.log(credentials);
        const client = await connectToDatabae();

        const usersCollection = client.db().collection("users");
        console.log("find existing user", credentials.email);
        const user = await usersCollection.findOne({
          email: credentials.email,
        });
        if (!user) {
          console.log("User not found!");
          client.close();
          //when throw an error inside authorize(), promise will be rejected, and it will then redirect to client to other page
          throw new Error("No user found!");
        }
        //console.log(user);
        console.log("User is found, then verify password");
        const isValid = await verifyPassword(
          credentials.password,
          user.password
        );
        console.log("verifyPassword result:", isValid);
        if (!isValid) {
          client.close();
          throw new Error("Could not log you in!");
        }

        client.close();

        //console.log("returning object");
        //when return an object inside authorize(), that means authorization succeed
        return { email: user.email };
      },
    }),
  ],
});
