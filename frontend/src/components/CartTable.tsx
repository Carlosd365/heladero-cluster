export type CartItem = { id_producto:number; nombre:string; precio:number; cantidad:number; stock?:number };

export default function CartTable(
    {items, onQty, onRemove}:{items:CartItem[]; onQty:(id:number,qty:number)=>void; onRemove:(id:number)=>void}
    ){
    const subtotal = items.reduce((s,i)=> s+i.precio*i.cantidad, 0);
    return (
        <div className="grid gap-2">
        <table className="w-full border rounded text-sm">
            <thead style={{background:'#f3f4f6'}}>
            <tr><th className="p-2">Producto</th><th>Cant.</th><th>Precio</th><th>Subtotal</th><th/></tr>
            </thead>
            <tbody>
            {items.map(i=>(
                <tr key={i.id_producto} className="border-t">
                <td className="p-2">{i.nombre}</td>
                <td className="p-2 w-24">
                    <input type="number" min={1} max={i.stock ?? undefined}
                    className="border rounded px-2 py-1 w-full"
                    value={i.cantidad} onChange={e=>onQty(i.id_producto, Number(e.target.value))}/>
                </td>
                <td className="p-2">Q {i.precio.toFixed(2)}</td>
                <td className="p-2">Q {(i.precio * i.cantidad).toFixed(2)}</td>
                <td className="p-2 text-right">
                    <button className="text-red-600" onClick={()=>onRemove(i.id_producto)}>Quitar</button>
                </td>
                </tr>
            ))}
            {!items.length && <tr><td className="p-4 text-center text-gray-500" colSpan={5}>Agrega productos</td></tr>}
            </tbody>
        </table>
        <div className="text-right font-semibold">Subtotal: $ {subtotal.toFixed(2)}</div>
        </div>
    );
}
