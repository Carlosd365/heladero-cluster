import api from "../api";

export const repo = {
    clientes(search = "") {
        return api
        .get("/clientes", { params: { search } })
        .then(r => r.data as {id_cliente:number;nombres:string;apellidos?:string;email?:string}[]);
    },
    productos(search = "", activo = 1) {
        return api
        .get("/productos", { params: { search, activo } })
        .then(r => r.data as {id_producto:number;nombre:string;precio:number;stock:number;activo:boolean|number}[]);
    },
    ventas(params: Record<string, any> = {}) {
        return api.get("/ventas", { params }).then(r => r.data as any[]);
    },
    venta(id: number|string) {
        return api.get(`/ventas/${id}`).then(r => r.data as any);
    },
    crearVenta(payload: {
        id_cliente:number;
        metodo_pago:string;
        estado:string;
        items:{id_producto:number; cantidad:number; precio_unitario:number}[];
    }) {
        return api.post("/ventas", payload).then(r => r.data as {ok:boolean; id_venta:number});
    }
};
