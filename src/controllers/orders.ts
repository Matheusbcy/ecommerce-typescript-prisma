import { Request, Response } from "express";
import { prismaClient } from "..";

export const createOrder = async (req: Request, res: Response) => {
  // 5. to define computed field for formatted address on address module (index.ts)

  // 1. to create a transaction
  return await prismaClient.$transaction(async (tx) => {
    // 2. to list all the cart items and proceed if cart is not empty
    const cartItems = await tx.cartItem.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: "cart is empty" });
    }
    // 3. calculate the total amount
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);
    // 4. fetch addres of user
    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress,
      },
    });

    const addressFormatted = address?.formattedAddress as string;

    // 6. we will create a order product order
    const order = await tx.order.create({
      data: {
        userId: req.user.id,
        netAmount: price,
        address: addressFormatted,
        products: {
          create: cartItems.map((cart) => {
            return {
              productId: cart.productId,
              quantity: cart.quantity,
            };
          }),
        },
      },
    });
    // 7. create event
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    // 8. to empty the cart
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json(order);
  });
};
export const listOrders = async (req: Request, res: Response) => {};
export const cancelOrder = async (req: Request, res: Response) => {};
export const getOrderById = async (req: Request, res: Response) => {};
