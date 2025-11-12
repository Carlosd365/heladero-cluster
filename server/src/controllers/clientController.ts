import { Request, Response } from "express";
import * as ClientService from "../services/clientServices";

export const getAllClients = async (req: Request, res: Response) => {
    try {
        const clients = await ClientService.getAllClients();

        if (clients.length === 0)
            return res.status(404).json({ message: "There are no clients in the database" });

        res.json(clients);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error"});
    }
};

export const getClientsByName = async (req: Request, res: Response) => {
    const { name } = req.query;

    if (typeof name !== "string") {
        return res.status(400).json({ message: "Query parameter 'name' must be a string" });
    }

    try {
        
        const clients = await ClientService.getClientsByName(name);
        if (clients.length === 0)
            return res.status(404).json({ message: `Clients named ${name} don't exist.` });
        res.json(clients);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    const id = req.params.id;

    if (typeof id !== "string") {
        return res.status(400).json({ message: "Query parameter 'id' must be a string" });
    }
    
    try {
        
        const client = await ClientService.getClientById(id);
        if (!client)
            return res.status(404).json({ message: `Client with id = ${id} doesn't exist.` });
        res.json(client);

    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};


export const createClient = async (req: Request, res: Response) => {
    const data = req.body;

    try {
        const newClient = await ClientService.createClient(data);
        res.status(201).json(newClient);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateClientById = async (req: Request, res: Response) => {
    const id = req.params.id;
    const data = req.body;

    try {
        const updateClient = await ClientService.updateClientById(id, data);
        res.status(200).json(updateClient);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteClientById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try {
        const deleteClient = await ClientService.deleleClientById(id);
        if (!deleteClient) {
            return res.status(404).json({ message: `Client with id ${id} not found` });
        }
        res.status(202).json(deleteClient);
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};
