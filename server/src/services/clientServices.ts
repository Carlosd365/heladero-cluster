import { ClientModel, Client } from '../models/Client'

export const getAllClients = async () => {
  const clients = await ClientModel.find({isDeleted: false})
  return clients;
};

export const getClientsByName = async (name: string) => {
  const client = await ClientModel.find({name: {$regex: name, $options: "i"}, isDeleted: false})
  return client;
};

export const getClientById = async (id: string) => {
  const client = await ClientModel.findById(id)
  return client;
};

export const createClient = async (data: Client) => {
  const client = new ClientModel({...data})
  return await client.save();
};

export const updateClientById = async (id: string, data: Client) => {
  const client = ClientModel.findByIdAndUpdate(id, {...data}, {new: true})
  return client
};

export const deleleClientById = async (id: string) => {
  const client = ClientModel.findByIdAndUpdate(id, {isDeleted: true}, {new: true})
  return client;
};