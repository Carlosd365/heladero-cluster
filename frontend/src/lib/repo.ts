import api from "../api";

export interface Cliente {
  _id: string;           
  name: string;
  email: string;
  phoneNumber: string;
  isDeleted: boolean;
}

export type ClienteCreate = Omit<Cliente, "_id" | "isDeleted">;

export type ClienteUpdate = Partial<ClienteCreate>;


export const repo = {
  clientes() {
    return api.get("/clients").then((r) => r.data as Cliente[]);
  },

  buscarClientes(name: string) {
    return api
      .get("/clients/search", { params: { name } })
      .then((r) => r.data as Cliente[]);
  },

  cliente(id: string) {
    return api.get(`/clients/${id}`).then((r) => r.data as Cliente);
  },

  crearCliente(payload: ClienteCreate) {
    return api.post("/clients", payload).then((r) => r.data as Cliente);
  },

  actualizarCliente(id: string, payload: ClienteUpdate) {
    return api.put(`/clients/${id}`, payload).then((r) => r.data as Cliente);
  },

  eliminarCliente(id: string) {
    return api
      .delete(`/clients/${id}`)
      .then((r) => r.data as Cliente);
  },
};