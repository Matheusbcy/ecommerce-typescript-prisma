import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFound } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createProduct = async(req: Request, res: Response) => {

    // Create a validator to for this request

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(',')
        } 
    })
    res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const product = req.body
        if(product.tags){
            product.tags = product.tags.join(",")
        }
        const updatedProduct = await prismaClient.product.update({
            where: {
                id: +req.params.id
            },
            data: product
        })
        res.json(updatedProduct)
    } catch (error) {
        throw new NotFound("Product not found", ErrorCode.PRODUCT_NOT_FOUND, null)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {

}

export const listProduct = async (req: Request, res: Response) => {

}

export const getProductById = async (req: Request, res: Response) => {

}