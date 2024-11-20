"use client"

import { Collection, Collections, newCollection } from "@/backend/api/collections";
import { useLoad } from "@/commons/load";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Admin() {
    const [opened, setOpened] = useState(false);
    const { data, reload, loading, error } = useLoad<Collection[]>(async () => Collections())
    const router = useRouter()

    return <>
        <div className="w-full">
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-slate-400">
                        <th className="p-2 w-11">ID</th>
                        <th className="text-left p-2">Nome</th>
                        <th className="text-left p-2 w-1/2">Descrição</th>
                        <th className="p-2 w-24">Imagens</th>
                        <th className="p-2 w-28">Respostas</th>
                    </tr>
                </thead>
                <tbody>
                    {error 
                        ? <tr><td colSpan={5} className="text-center">Erro ao Carregar</td></tr>
                        : loading 
                            ? <tr><td colSpan={5} className="text-center">Carregando</td></tr>
                            : data?.map((i, idx) => <tr key={i.id} onClick={() => router.push(`/admin/${i.id}`)} className={`text-sm cursor-pointer ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-200'} ${idx % 2 === 0 ? 'hover:bg-slate-300' : 'hover:bg-slate-300'}`}>
                                <td className="p-1 pl-2 pr-2 text-center">{i.id}</td>
                                <td className="p-1 pl-2 pr-2">{i.name}</td>
                                <td className="p-1 pl-2 pr-2">{i.description}</td>
                                <td className="p-1 pl-2 pr-2 text-center">{i.quantity}</td>
                                <td className="p-1 pl-2 pr-2 text-center">{i.answers}</td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
        <div className="fixed w-14 h-14 rounded-full bg-slate-700 shadow-lg transition-colors hover:bg-slate-800 hover:shadow-xl right-5 bottom-5 cursor-pointer" onClick={() => setOpened(true)}>
            <i className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[2px] h-5 bg-white"></i>
            <i className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-5 h-[2px] bg-white"></i>
        </div>
        <NewCollection open={opened} close={() => setOpened(false)} reload={() => reload()}/>
    </>
}

function NewCollection({open, reload, close}: {open: boolean; reload: () => void; close: () => void}) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    
    return <div className={`fixed flex flex-col justify-center items-center w-full h-full bg-[rgb(0,0,0,0.75)] z-50 left-0 top-0 ${open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'} transition-all`}>
        <div className={`w-[500px] bg-slate-500 rounded-lg p-2 transition-opacity${loading ? ' opacity-50 pointer-events-none' : ''}`}>
            <div className="text-white text-center font-bold text-base p-2 pt-0 mb-2">Nova Coleção</div>
            <div className="text-red-800 text-xs mb-2">{message}</div>
            <div>
                <input 
                    className="bg-slate-200 w-full p-1.5 text-sm rounded-md" 
                    value={name} 
                    onInput={(e) => setName(e.currentTarget.value)}
                    placeholder="Nome da coleção"
                />
            </div>
            <div className="mt-2">
                <input 
                    className="bg-slate-200 w-full p-1.5 text-sm rounded-md" 
                    value={description} 
                    onInput={(e) => setDescription(e.currentTarget.value)}
                    placeholder="Descrição da Coleção"
                />
            </div>
            <div className="flex flex-row mt-4 gap-3">
                <div 
                    className="flex-1 text-center p-1.5 font-bold text-white bg-green-800 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                    onClick={async () => {
                        setLoading(true)
                        setMessage('')

                        const result = await newCollection(name, description)

                        if (result.success) {
                            close()
                            reload()

                            setName('')
                            setDescription('')
                            setLoading(false)
                        } else {
                            setMessage(result.message as string)
                        }
                    }}
                >Criar</div>
                <div 
                    className="flex-1 text-center p-1.5 font-bold text-white bg-red-800 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
                    onClick={() => close()}
                >Cancelar</div>
            </div>
        </div>
    </div>
}