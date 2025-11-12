import { Request, Response } from "express";
import * as ProductService from "../services/productServices";

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await ProductService.getAllProducts();

        if (products.length === 0)
            return res.status(404).json({ message: "There are no products in the database" });

        res.json(products);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error"});
    }
};

export const getProductsByName = async (req: Request, res: Response) => {
    const { name } = req.query;

    if (typeof name !== "string") {
        return res.status(400).json({ message: "Query parameter 'name' must be a string" });
    }

    try {
        
        const products = await ProductService.getProductsByName(name);
        if (products.length === 0)
            return res.status(404).json({ message: `Products named ${name} don't exist.` });
        res.json(products);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "Query parameter 'id' must be a string" });
    }
    
    try {
        
        const product = await ProductService.getProductById(id);
        if (!product)
            return res.status(404).json({ message: `Product with id = ${id} doesn't exist.` });
        res.json(product);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};


export const createProduct = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const newProduct = await ProductService.createProduct(data);
        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateProductById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const updateProduct = await ProductService.updateProductById(id, data);
        res.status(200).json(updateProduct);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleleProductById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const deleteProduct = await ProductService.deleleProductById(id);
        if (!deleteProduct) {
            return res.status(404).json({ message: `Product with id ${id} not found` });
        }
        res.status(202).json(deleteProduct);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};
