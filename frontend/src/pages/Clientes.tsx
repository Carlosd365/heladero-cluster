import { useEffect, useState } from "react";
import { repo } from "../lib/repo";

export default function Clientes(){
    const [q, setQ] = useState(""); const [rows, setRows] = useState<any[]>([]);
    useEffect(()=>{ repo.clientes(q).then(setRows).catch(console.error); },[q]);

    return (
        <section className="grid gap-3">
        <input className="border rounded px-3 py-2 w-72" placeholder="Buscar cliente..."
                value={q} onChange={e=>setQ(e.target.value)} />
        <div className="overflow-auto border rounded bg-white">
            <table className="w-full text-sm">
            <thead style={{background:'#f3f4f6'}}>
                <tr><th className="p-2 text-left">ID</th><th className="p-2 text-left">Nombre</th><th className="p-2 text-left">Email</th></tr>
            </thead>
            <tbody>
                {rows.map((r:any)=>(
                <tr key={r.id_cliente} className="border-t">
                    <td className="p-2">{r.id_cliente}</td>
                    <td className="p-2">{r.nombres} {r.apellidos ?? ""}</td>
                    <td className="p-2">{r.email ?? "-"}</td>
                </tr>
                ))}
                {!rows.length && <tr><td className="p-4 text-center text-gray-500" colSpan={3}>Sin datos</td></tr>}
            </tbody>
            </table>
        </div>
        </section>
    );
}
