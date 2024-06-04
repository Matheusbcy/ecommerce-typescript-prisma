import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFound } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { BadRequestsException } from "../exceptions/bad-request";

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

export const listOrders = async (req: Request, res: Response) => {
  console.log(req.user.id);
  const orders = await prismaClient.order.findMany({
    where: {
      userId: +req.user.id,
    },
  });

  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
    try {
      // 1. Wrap it inside transaction
      const order = await prismaClient.$transaction(async (tx) => {
        const orderCheck = await tx.order.findFirst({
          where: {
            id: +req.params.id,
          },
        });
  
        // 2. Check if the user is cancelling their own order
        if (!orderCheck || orderCheck.userId !== req.user.id) {
          throw new NotFound(
            "You are not allowed to delete this order item",
            ErrorCode.UNAUTHORIZED,
            null
          );
        }
  
        // Update the order status to 'CANCELLED'
        const updatedOrder = await tx.order.update({
          where: {
            id: +req.params.id,
          },
          data: {
            status: "CANCELLED",
          },
        });
  
        // Create an order event for cancellation
        await tx.orderEvent.create({
          data: {
            orderId: updatedOrder.id,
            status: "CANCELLED",
          },
        });
  
        return updatedOrder;
      });
  
      // Send the response
      res.json(order);
  
    } catch (err) {
      if (err instanceof NotFound) {
        res.status(404).json({ message: err.message });
      } else {
        res.status(500).json({ message: "An error occurred while cancelling the order." });
      }
    }
  };

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: +req.params.id,
      },
      include: {
        products: true,
        events: true,
      },
    });
    res.json(order);
  } catch (err) {
    throw new NotFound("Order not found", ErrorCode.ORDER_NOT_FOUND, null);
  }
};
