import { useState } from "react";
import { repo } from "../lib/repo";
import Autocomplete from "../components/Autocomplete";
import CartTable from "../components/CartTable";
import type { CartItem } from "../components/CartTable";
import { useNavigate } from "react-router-dom";

export default function NuevaVenta(){
    const [cliente, setCliente] = useState<any|null>(null);
    const [items, setItems] = useState<CartItem[]>([]);
    const [metodo, setMetodo] = useState("efectivo");
    const nav = useNavigate();

    const addProd = (p:any) => {
        setItems(prev=>{
        const i = prev.find(x=>x.id_producto===p.id_producto);
        if (i) return prev.map(x=>x.id_producto===p.id_producto? {...x, cantidad:x.cantidad+1}:x);
        return [...prev, { id_producto:p.id_producto, nombre:p.nombre, precio:Number(p.precio), cantidad:1, stock:p.stock }];
        });
    };
    const onQty = (id:number, qty:number)=> setItems(prev=>prev.map(x=>x.id_producto===id? {...x, cantidad:qty}:x));
    const onRemove = (id:number)=> setItems(prev=>prev.filter(x=>x.id_producto!==id));

    const subtotal = items.reduce((s,i)=> s+i.precio*i.cantidad, 0);

    const confirmar = async () => {
        const payload = {
        id_cliente: cliente?.id_cliente,
        metodo_pago: metodo,
        estado: "pagada",
        items: items.map(i=>({ id_producto: i.id_producto, cantidad: i.cantidad, precio_unitario: i.precio }))
        };
        const r = await repo.crearVenta(payload);
        alert(`Venta #${r.id_venta} creada`);
        nav("/ventas");
    };

    return (
        <section className="grid gap-4">
        <div className="flex gap-3 items-center">
            <label className="text-sm text-gray-600">Cliente</label>
            <Autocomplete fetcher={q=>repo.clientes(q)} onSelect={setCliente} placeholder="Buscar cliente..." />
            {cliente && <span className="px-2 py-1 bg-gray-200 rounded text-sm">{cliente.nombres} {cliente.apellidos}</span>}
            <div className="ml-auto flex gap-2 items-center">
            <label>Método</label>
            <select value={metodo} onChange={e=>setMetodo(e.target.value)} className="border rounded px-2 py-1">
                <option value="efectivo">Efectivo</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
            </select>
            </div>
        </div>

        <div className="flex gap-3 items-end">
            <Autocomplete fetcher={q=>repo.productos(q)} onSelect={addProd} placeholder="Buscar producto..." />
        </div>

        <CartTable items={items} onQty={onQty} onRemove={onRemove} />

        <div className="flex justify-end items-center gap-6">
            <div className="text-xl">Total: <b>$ {subtotal.toFixed(2)}</b></div>
            <button className="px-4 py-2 rounded bg-black text-white"
                    disabled={!cliente || !items.length}
                    onClick={confirmar}>
            Confirmar
            </button>
        </div>
        </section>
    );
}
