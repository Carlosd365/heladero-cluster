import { Product, ProductModel } from "../models/Product";

export const getAllProducts = async () => {
    const products = await ProductModel.find()
    return products;
};

export const getProductsByName = async (name: string) => {
    const product = await ProductModel.find({name: {$regex: name, $options: "i"}})
    return product;
};

export const getProductById = async (id: string) => {
    const product = await ProductModel.findById(id)
    return product;
};

export const createProduct = async (data: Product) => {
    const product = new ProductModel({...data})
    return await product.save();
};

export const updateProductById = async (id: string, data: Product) => {
    const product = ProductModel.findByIdAndUpdate(id, {...data}, {new: true})
    return product
};

export const deleleProductById = async (id: string) => {
    const product = ProductModel.findByIdAndUpdate(id, {active: false}, {new: true})
    return product;
};