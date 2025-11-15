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

export interface Producto {
  _id: string;           
  name: string;
  price: number;
  stock: number;
  active: boolean
}

export type ProductoCreate = Omit<Producto, "_id">;
export type ProductoUpdate = Partial<ProductoCreate>;

export interface Venta {
  _id: string;
  client: {
    _id: string;
    name: string;
  };
  payment_method: string;
  total: number;
  products: {
    _id: string;
    name: string;
    amount: number;
    price: number;
    subtotal: number;
  }[];
  deleted: boolean;
  date: {
    $date: string; 
  };
}

export type VentaCreate = Omit<Venta, "_id" | "deleted" | "date">;


export const repo = {

  // Clientes

  clientes() {
    return api.get("/clients").then((r) => r.data as Cliente[]);
  },

  buscarClientes(name: string) {
    return api
      .get("/clients/search", { params: { name } })
      .then((r) => r.data);
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

  //Productos

  productos() {
    return api.get("/products").then((r) => r.data as Producto[]);
  },

  buscarProductos(name: string) {
    return api
      .get("/products/search", { params: { name } })
      .then((r) => r.data);
  },

  producto(id: string) {
    return api.get(`/products/${id}`).then((r) => r.data as Producto);
  },

  crearProducto(payload: ProductoCreate) {
    return api.post("/products", payload).then((r) => r.data as Producto);
  },

  actualizarProducto(id: string, payload: ProductoUpdate) {
    return api.put(`/products/${id}`, payload).then((r) => r.data as Producto);
  },

  eliminarProducto(id: string) {
    return api
      .delete(`/products/${id}`)
      .then((r) => r.data as Producto);
  },

  //Ventas

  ventas() {
    return api.get("/sales").then((r) => r.data as Venta[]);
  },

  ventaPorFecha(from: string, to: string) {
    return api.get("/sales/date", { params: { from, to } }).then((r) => r.data as Venta[]);
  },

  buscarVentas(name: string) {
    return api.get("/sales/search", { params: { name } }).then((r) => r.data as Venta[]);
  },

  venta(id: string) {
    return api.get(`/sales/${id}`).then((r) => r.data as Venta);
  },

  crearVenta(payload: VentaCreate) {
    return api.post("/sales", payload).then((r) => r.data as Venta);
  },

  eliminarVenta(id: string) {
    return api
      .delete(`/sales/${id}`)
      .then((r) => r.data as Venta);
  },

};