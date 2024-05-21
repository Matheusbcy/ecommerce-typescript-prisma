import { Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response) => {
  try {
    const { nome, email, password } = req.body;

    if (!nome || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required." });
    }

    const saltsRonds = 8;

    if (typeof password !== "string" || password.trim() === "") {
      return res.status(400).json({
        error: "Password is required and must be a non-empty string.",
      });
    }

    const hashedPassword = bcrypt.hashSync(password, saltsRonds);

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (user) {
      throw new Error("User already exists!");
    }

    user = await prismaClient.user.create({
      data: {
        nome,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};
