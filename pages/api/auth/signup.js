import { connectToDatabae } from "../../../lib/db";
import { hashPassword } from "../../../lib/auth";

async function handler(req, res) {
  const data = req.body;
  const { email, password } = data;

  if (
    !email ||
    !email.includes("@") ||
    !password ||
    password.trim().length < 7
  ) {
    res.status(422).json({
      message: "Invalid input - password should be at least 7 characters long",
    });
    return;
  }
  const client = await connectToDatabae();
  const db = client.db();
  const hashedPassword = hashPassword(password);
  const result = await db.collection("users").insertOne({
    email: email,
    password: hashedPassword,
  });

  res.status(200).json({message: "Created user!"});
}

export default handler;
