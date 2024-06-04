import { Request, Response } from "express";
import { CreateCartSchema, changeQuantitySchema } from "../schema/cart";
import { NotFound } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product;
  try {
    product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: validatedData.productId,
      },
    });
  } catch (error) {
    throw new NotFound("Product not found!", ErrorCode.PRODUCT_NOT_FOUND, null);
  }

  const existingCartItem = await prismaClient.cartItem.findFirst({
    where: {
      userId: req.user.id,
      productId: product.id,
    },
  });

  let cartItem;

  if (existingCartItem) {
    cartItem = await prismaClient.cartItem.update({
      where: {
        id: existingCartItem.id,
      },
      data: {
        quantity: existingCartItem.quantity + validatedData.quantity,
      },
    });
  } else {
    cartItem = await prismaClient.cartItem.create({
      data: {
        userId: req.user.id,
        productId: product.id,
        quantity: validatedData.quantity,
      },
    });
  }

  res.json(cartItem);
};
export const deleteItemFromCart = async (req: Request, res: Response) => {
  const cartItemId = +req.params.id;

  const cartItem = await prismaClient.cartItem.findUnique({
    where: {
      id: cartItemId,
    },
  });

  if (!cartItem) {
    return res.status(404).json({ error: "Cart item not found" });
  }

  if (cartItem.userId !== req.user.id) {
    throw new NotFound(
      "You are not allowed to delete this cart item",
      ErrorCode.UNAUTHORIZED,
      null
    );
  }

  await prismaClient.cartItem.delete({
    where: {
      id: +req.params.id,
    },
  });
  res.json({ success: true });
};
export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = changeQuantitySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: +req.params.id,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};
export const getCart = async (req: Request, res: Response) => {
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id
    },
    include: {
      product: true
    }
  })
  res.json(cart)
};
