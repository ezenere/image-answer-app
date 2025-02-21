"use client"

import { FullItems, FullItem, removeAnswer, addAnswer, newImageFile, updateQuestion } from "@/backend/api/items";
import { useLoad } from "@/commons/load";
import { useParams } from "next/navigation";
import { useState } from "react";

export default function Admin() {
    const [opened, setOpened] = useState(false);
    const { collection } = useParams()

    const { data, reload, loading, error } = useLoad<FullItem[]>(async () => FullItems(parseInt(collection as string)), [collection])

    return <>
        <div className="w-full">
            <table className="w-full table-fixed">
                <thead>
                    <tr className="bg-slate-400">
                        <th className="p-2 w-11 border border-slate-700">ID</th>
                        <th className="text-center p-2 border border-slate-700 w-1/4">Imagem</th>
                        <th className="text-center p-2 border border-slate-700">Respostas</th>
                    </tr>
                </thead>
                <tbody>
                    {error 
                        ? <tr><td colSpan={3} className="text-center">Erro ao Carregar</td></tr>
                        : loading 
                            ? <tr><td colSpan={3} className="text-center">Carregando</td></tr>
                            : data?.map((i, idx) => <tr key={i.id} className={`text-sm ${idx % 2 === 0 ? 'bg-transparent' : 'bg-slate-200'}`}>
                                <td className="p-1 pl-2 pr-2 text-center border border-slate-300">{i.id}</td>
                                <td className="p-1 pl-2 pr-2 border border-slate-300">
                                    <Question collection={parseInt(collection as string)} item={i}  />
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={`/api/images/${collection}/${i.identifier}`} alt="Item image" />
                                </td>
                                <td className="p-1 pl-2 pr-2 border border-slate-300">
                                    <Answers item={i} collection={collection as string} />
                                </td>
                            </tr>)
                    }
                </tbody>
            </table>
        </div>
        <div className="fixed w-14 h-14 rounded-full bg-slate-700 shadow-lg transition-colors hover:bg-slate-800 hover:shadow-xl right-5 bottom-5 cursor-pointer" onClick={() => setOpened(true)}>
            <i className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-[2px] h-5 bg-white"></i>
            <i className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] w-5 h-[2px] bg-white"></i>
        </div>
        <NewImage open={opened} close={() => setOpened(false)} reload={() => reload()} collection={parseInt(collection as string)}/>
    </>
}

function Question({collection, item}: {collection: number; item: FullItem;}) {
    const [question, setQuestion] = useState(item.question);

    return (
        <div className="mb-2">
            <input className="w-full p-1.5 text-sm rounded-md bg-slate-100 border border-slate-200" placeholder="Digite uma pergunta para a imagem" value={question} onChange={(e) => setQuestion(e.currentTarget.value)} onBlur={async () => {
                const r = await updateQuestion(collection, item.id, question)

                if (!r.success) {
                    setQuestion(item.question);
                } else {
                    item.question = question;
                }
            }}/>
        </div>
    )
}

function Answers({item, collection}: {item: FullItem, collection: string}) {
    const [answers, setAnswers] = useState(item.answers || [])
    const [newValue, setNewValue] = useState('')
    const [loading, setLoading] = useState(false);

    const addValue = () => {
        if(newValue.trim() === '') return

        setLoading(true)
        addAnswer(parseInt(collection), item.id, newValue).then((r) => {
            if(r.success) {
                setAnswers((p) => [...p, {id: r.id || 0, text: newValue}])
                setNewValue('')
            }
            setLoading(false)
        })
    }

    return <div className={loading ? 'opacity-50 pointer-events-none' : ''}>
        {answers.map((i) => {
            return <div key={i.id} className="flex gap-3 mb-2 pb-2 border-b border-slate-100">
                <div className="flex-initial text-white rounded-md bg-red-800 p-1 pl-4 pr-4 cursor-pointer" onClick={() => {
                    setLoading(true)
                    removeAnswer(i.id).then((r) => {
                        console.log('runonce')
                        setLoading(false)
                        if(r) setAnswers((p) => {
                            const index = p.findIndex(it => it.id === i.id)
                            if(index !== -1){
                                p.splice(index, 1)
                                return [ ...p ]
                            } else return p
                        })
                    })
                }}>Remover</div>
                <div className="flex flex-1 items-center"><span>{i.text}</span></div>
            </div>
        })}
        <div className="flex gap-3">
            <div className="flex-1"><input className="w-full p-2 text-sm rounded-md bg-slate-100 border border-slate-200" placeholder="Digite aqui uma resposta" value={newValue} onKeyDown={(e) => {if(e.key.includes('Enter')) addValue()}} onInput={(e) => setNewValue(e.currentTarget.value)} /></div>
            <div className="flex-initial text-white rounded-md bg-green-800 p-1 pl-4 pr-4 cursor-pointer flex items-center" onClick={() => addValue()}><span>Salvar</span></div>
        </div>
    </div>
}

function NewImage({open, reload, close, collection}: {open: boolean; reload: () => void; close: () => void; collection: number}) {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const [value, setValue] = useState('')
    const [file, setFile] = useState<null | FileList>(null)
    const [question, setQuestion] = useState('');
    
    return <div className={`fixed flex flex-col justify-center items-center w-full h-full bg-[rgb(0,0,0,0.75)] z-50 left-0 top-0 ${open ? 'visible opacity-100' : 'invisible opacity-0 pointer-events-none'} transition-all`}>
        <div className={`w-[500px] bg-slate-500 rounded-lg p-2 transition-opacity${loading ? ' opacity-50 pointer-events-none' : ''}`}>
            <div className="text-white text-center font-bold text-base p-2 pt-0 mb-2">Nova Coleção</div>
            <div className="text-red-800 text-xs mb-2">{message}</div>
            <div className="mt-2">
                <input 
                    className="bg-slate-200 w-full p-1.5 text-sm rounded-md" 
                    value={question} 
                    onChange={(e) => setQuestion(e.currentTarget.value)}
                    type="text"
                    placeholder="Digite uma pergunta para a imagem"
                />
            </div>
            <div className="mt-2">
                <input 
                    className="bg-slate-200 w-full p-1.5 text-sm rounded-md" 
                    value={value} 
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                        setFile(e.currentTarget.files)
                    }}
                    type="file"
                    accept="image/jpeg,image/png,image/bmp,image/web,image/gif"
                />
            </div>
            <div className="flex flex-row mt-4 gap-3">
                <div 
                    className="flex-1 text-center p-1.5 font-bold text-white bg-green-800 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
                    onClick={async () => {
                        if((file?.length || 0) === 0) return

                        setLoading(true)
                        setMessage('')

                        
                        const buffer = await file?.item(0)?.arrayBuffer()
                        if(buffer){
                            const result = await newImageFile(collection, buffer, question)

                            setLoading(false)
                            if (result.success) {
                                close()
                                reload()
                                setValue('')
                                setFile(null)
                                setQuestion('')
                            } else {
                                setMessage(result.message as string)
                            }
                        } else {
                            setMessage('Erro ao gerar buffer')
                            setLoading(false)
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