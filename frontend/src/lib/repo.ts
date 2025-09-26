import api from "../api";

export interface Cliente {
  id_cliente: number;
  nombres: string;
  apellidos?: string | null;
  email?: string | null;
  telefono?: string | null;
}
export type ClienteCreate = Omit<Cliente, "id_cliente">;
export type ClienteUpdate = Partial<Omit<Cliente, "id_cliente">>;

export interface Producto {
  id_producto: number;
  nombre: string;
  precio: number;
  stock: number;
  activo: 0 | 1 | boolean;
}
export type ProductoCreate = Omit<Producto, "id_producto">;
export type ProductoUpdate = Partial<Omit<Producto, "id_producto">>;

export interface VentaDetalle {
  id_detalle_venta: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  nombre?: string;
}

export interface Venta {
  id_venta: number;
  id_cliente?: number | null;
  metodo_pago?: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";
  estado?: "ABIERTA" | "PAGADA" | "ANULADA";
  subtotal?: number;
  total?: number;
  fecha?: string;
  detalle?: VentaDetalle[];
}

export interface CrearVentaPayload {
  id_cliente?: number | null;
  metodo_pago?: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA" | "QR";
}

export interface CrearVentaResponse {
  id_venta: number;
}

export const repo = {
  clientes(search = "") {
    return api
      .get("/clientes", { params: { search } })
      .then((r) => r.data as Cliente[]);
  },
  cliente(id: number | string) {
    return api.get(`/clientes/${id}`).then((r) => r.data as Cliente);
  },
  crearCliente(payload: ClienteCreate) {
    return api.post("/clientes", payload).then((r) => r.data as Cliente);
  },
  actualizarCliente(id: number | string, payload: ClienteUpdate) {
    return api.put(`/clientes/${id}`, payload).then((r) => r.data as Cliente);
  },
  eliminarCliente(id: number | string) {
    return api
      .delete(`/clientes/${id}`)
      .then((r) => r.data as { ok: boolean });
  },


  productos(search = "", activo: 0 | 1 | boolean = 1) {
    return api
      .get("/productos", {
        params: {
          search,
          activo: typeof activo === "boolean" ? (activo ? 1 : 0) : activo,
        },
      })
      .then((r) => r.data as Producto[]);
  },
  producto(id: number | string) {
    return api.get(`/productos/${id}`).then((r) => r.data as Producto);
  },
  crearProducto(payload: ProductoCreate) {
    return api.post("/productos", payload).then((r) => r.data as Producto);
  },
  actualizarProducto(id: number | string, payload: ProductoUpdate) {
    return api.put(`/productos/${id}`, payload).then((r) => r.data as Producto);
  },
  eliminarProducto(id: number | string) {
    return api
      .delete(`/productos/${id}`)
      .then((r) => r.data as { ok: boolean });
  },


  ventas(params: Record<string, any> = {}) {
    return api.get("/ventas", { params }).then((r) => r.data as Venta[]);
  },
  venta(id: number | string) {
    return api.get(`/ventas/${id}`).then((r) => r.data as Venta);
  },
  crearVenta(payload: CrearVentaPayload) {
    return api.post("/ventas", payload).then((r) => r.data as CrearVentaResponse);
  },
  pagarVenta(id: number | string, payload?: Record<string, any>) {
    return api
      .put(`/ventas/${id}/pagar`, payload ?? {})
      .then((r) => r.data as { ok: boolean });
  },
  anularVenta(id: number | string, payload?: Record<string, any>) {
    return api
      .put(`/ventas/${id}/anular`, payload ?? {})
      .then((r) => r.data as { ok: boolean });
  },


  agregarDetalleVenta(
    idVenta: number | string,
    item: { id_producto: number; cantidad: number; precio_unitario?: number }
  ) {
    return api
      .post(`/ventas/${idVenta}/detalle`, item)
      .then((r) => r.data as { ok: boolean; id_detalle: number });
  },
  eliminarDetalleVenta(idVenta: number | string, idDetalle: number | string) {
    return api
      .delete(`/ventas/${idVenta}/detalle/${idDetalle}`)
      .then((r) => r.data as { ok: boolean });
  },


  detallesVenta_list() {
    return api.get("/detalle-ventas").then((r) => r.data as VentaDetalle[]);
  },
  detalleVenta_get(idDetalle: number | string) {
    return api
      .get(`/detalle-ventas/${idDetalle}`)
      .then((r) => r.data as VentaDetalle);
  },
};
