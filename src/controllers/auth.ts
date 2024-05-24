import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { SignUpSchema } from "../schema/users";
import { NotFound } from "../exceptions/not-found";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  SignUpSchema.parse(req.body);
  const { nome, email, password } = req.body;
  const saltsRonds = 8;
  const hashedPassword = bcrypt.hashSync(password, saltsRonds);

  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    new BadRequestsException(
      "User already exists!",
      ErrorCode.USER_ALREADY_EXISTS
    );
  }
  user = await prismaClient.user.create({
    data: {
      nome,
      email,
      password: hashedPassword,
    },
  });
  res.status(201).json(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  let user = await prismaClient.user.findFirst({ where: { email } });

  if (!user) {
    throw new NotFound("user does not exists!", ErrorCode.USER_NOT_FOUND, null);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    throw new BadRequestsException(
      "Incorrect Password",
      ErrorCode.INCORRECT_PASSWORD
    );
  }
  const token = jwt.sign(
    {
      userId: user.id,
    },
    JWT_SECRET
  );
  res.json({ user, token });
};
