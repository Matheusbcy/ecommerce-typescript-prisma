import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestsException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
import { UnprocessableEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";

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
    return next(
      new BadRequestsException(
        "User already exists!",
        ErrorCode.USER_ALREADY_EXISTS
      )
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
  try {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });

    if (!user) {
      return next(
        new BadRequestsException(
          "User does not exists",
          ErrorCode.USER_NOT_FOUND
        )
      );
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return next(
        new BadRequestsException(
          "Incorrect password",
          ErrorCode.INCORRECT_PASSWORD
        )
      );
    }
    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  } catch (error) {
    res.send(error);
  }
};
