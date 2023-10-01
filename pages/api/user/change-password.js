// /api/user/change-password
import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";

async function handler(req, res) {
  console.log("req.method = ", req.method);
  if (req.method !== "PATCH") {
    return;
  }

  //getSession looks into the request to see if a session token is part of the request
  //if it is, then it validates and extracts that data from cookie
  //const session = await getSession({ req: req });
  const session = await getServerSession(req, res, authOptions);
  console.log("session got");
  console.log(session);
  if (!session) {
    console.log("no session");
    res.status(401).json({ message: "Not authenticated!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();
  const userCollection = client.db().collection("users");
  const user = await userCollection.findOne({ email: userEmail });
  if (!user) {
    res.status(401).json({ message: "User not found" });
    client.close();
    return;
  }

  const currrentPassword = user.password;
  const passwordsAreEqual = await verifyPassword(oldPassword, currrentPassword);
  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Invalid password" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);
  const result = await userCollection.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password updated" });
}

export default handler;
