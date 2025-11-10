import { Request, Response } from "express";
import * as userService from "../services/userServices";

export const getUsers = async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
};

export const getUser = async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
};

export const createUser = async (req: Request, res: Response) => {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
};

export const deleteUser = async (req: Request, res: Response) => {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado correctamente" });
};
