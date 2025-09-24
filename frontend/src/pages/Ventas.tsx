import { useEffect, useState } from "react";
import { repo } from "../lib/repo";
import { Link } from "react-router-dom";

export default function Ventas(){
    const [rows, setRows] = useState<any[]>([]);
    const [from,setFrom] = useState(""); const [to,setTo] = useState("");

    useEffect(()=>{
        const params:any = {}; if(from) params.from = from; if(to) params.to = to;
        repo.ventas(params).then(setRows).catch(console.error);
    },[from,to]);

    return (
        <section className="grid gap-3">
        <div className="flex gap-2 items-end">
            <div><label>Desde</label><input type="date" value={from} onChange={e=>setFrom(e.target.value)} className="border rounded px-3 py-2"/></div>
            <div><label>Hasta</label><input type="date" value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-3 py-2"/></div>
            <Link to="/ventas/nueva" className="ml-auto px-3 py-2 rounded bg-black text-white">Nueva venta</Link>
        </div>

        <div className="overflow-auto border rounded bg-white">
            <table className="w-full text-sm">
            <thead style={{background:'#f3f4f6'}}>
                <tr><th className="p-2 text-left">ID</th><th className="p-2">Fecha</th><th className="p-2 text-left">Cliente</th><th className="p-2">Total</th><th className="p-2">Estado</th></tr>
            </thead>
            <tbody>
                {rows.map((r:any)=>(
                <tr key={r.id_venta} className="border-t">
                    <td className="p-2">{r.id_venta}</td>
                    <td className="p-2">{new Date(r.fecha).toLocaleString()}</td>
                    <td className="p-2">{r.cliente?.nombres ? `${r.cliente.nombres} ${r.cliente.apellidos ?? ""}` : r.id_cliente}</td>
                    <td className="p-2 text-right">$ {Number(r.total).toFixed(2)}</td>
                    <td className="p-2 text-center">{r.estado}</td>
                </tr>
                ))}
                {!rows.length && <tr><td className="p-4 text-center text-gray-500" colSpan={5}>Sin datos</td></tr>}
            </tbody>
            </table>
        </div>
        </section>
    );
}
