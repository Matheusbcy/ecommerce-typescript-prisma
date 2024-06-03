import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFound } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async (req: Request, res: Response) => {
  // Create a validator to for this request

  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = req.body;
    if (product.tags) {
      product.tags = product.tags.join(",");
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: +req.params.id,
      },
      data: product,
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new NotFound("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null);
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    await prismaClient.product.delete({
      where: {
        id: +req.params.id,
      },
    });
    res.json("Produto deletada com sucesso");
  } catch (error) {
    throw new NotFound("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null);
  }
};

export const listProduct = async (req: Request, res: Response) => {
  const count = await prismaClient.product.count();

  const { skip = "0" } = req.query;
  const skipValue = parseInt(skip as string, 10) || 0;

  const products = await prismaClient.product.findMany({
    skip: skipValue,
    take: 5,
  });
  res.json({
    count,
    data: products,
  });
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prismaClient.product.findFirstOrThrow({
      where: {
        id: +req.params.id
      }
    })
    res.json(product)
  } catch (error) {
    throw new NotFound("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null);
  }
};
