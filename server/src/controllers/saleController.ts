import { Request, Response } from "express";
import * as SaleServices from '../services/saleServices'

export const getAllSales = async (_req: Request, res: Response) => {
    try {
        const sales = await SaleServices.getAllSales();

        if (sales.length === 0)
            return res.status(404).json({ message: "There are no sales in the database" });

        res.json(sales);

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getAllSalesByDate = async (req: Request, res: Response) => {

    const fromStr = req.query.from as string;
    const toStr = req.query.to as string;

    if (!fromStr || !toStr) {
        return res.status(400).json({ message: "from y to son requeridos" });
    }

    const parseLocalDate = (str: string) => {
        const [y, m, d] = str.split("-").map(Number);
        return new Date(y, m - 1, d);
    };

    const from = parseLocalDate(fromStr);
    const to = parseLocalDate(toStr);

    // Normalizar
    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 59, 999);

    try {
        const sales = await SaleServices.getAllSalesByDate(from, to);
        if (sales.length === 0) {
            return res.json([]); 
        }
        res.json(sales);
    } catch (error: any) {
    res.status(500).json({ message: error.message });
    }
};

export const getSaleById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "Query parameter 'id' must be a string" });
    }
    
    try {
        
        const sale = await SaleServices.getSaleById(id);
        if (!sale)
            return res.status(404).json({ message: `Sale with id = ${id} doesn't exist.` });
        res.json(sale);

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const getSalesByClientName = async (req: Request, res: Response) => {
    const name = req.query;

    if (typeof name !== "string") {
        return res.status(400).json({ message: "Query parameter 'name' must be a string" });
    }
    
    try {
        
        const sale = await SaleServices.getSalesByClientName(name);
        if (!sale)
            return res.status(404).json({ message: `Sale with client name = ${name} doesn't exist.` });
        res.json(sale);

    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};


export const createSale = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const newProduct = await SaleServices.createSale(data);
        res.status(201).json(newProduct);
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};

export const deletedSaleById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const deletedSale = await SaleServices.deletedSaleById(id);
        if (!deletedSale) {
            return res.status(404).json({ message: `Sale with id ${id} not found` });
        }
        res.status(202).json(deletedSale);
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message || "Internal server error" });
    }
};