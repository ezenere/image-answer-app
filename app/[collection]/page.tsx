"use client"

import { checkAnswerBase as checkAnswer, ItemsBase as Items } from "@/backend/api/items"
import Image from "next/image";
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

//import {CollectionImages} from "@prisma/client"

type Item = { id: number; identifier: string, count?: boolean }


export default function Test() {
    const { collection } = useParams()
    const [items, setItems] = useState<Item[]>([])
    const [currentItem, setCurrentItem] = useState<Item>()
    const [finished, setFinished] = useState(false)

    const [message, setMessage] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)

    const [hit, setHit] = useState(0)
    const [miss, setMiss] = useState(0)

    const [val, setVal] = useState('')

    const [finalTime, setFinalTime] = useState('')
    const updateFinalTime = (s: string) => {
        setFinalTime(s)
    }

    const next = (it: Item[], remove: boolean) => {
        if(it.length > 0 || !remove) {
            setMessage('')
            setVal('')
            const index = Math.floor(Math.random()*(it.length))
            if (remove || it.length > 0){
                setCurrentItem(it.splice(index, 1)[0])
                setItems(!remove && currentItem ? [...it, {...currentItem, count: false}] : [...it])
            } else if(currentItem) {
                setCurrentItem({ ...currentItem, count: false })
            }
        } else setFinished(true)
    }

    useEffect(() => {
        Items(parseInt(collection as string)).then((r) => next(r, true))
    }, [collection])

    console.log(currentItem)

    const correct = useCallback((text: string) => {
        setLoading(true)

        checkAnswer(parseInt(collection as string), currentItem?.id || 0, text).then((r) => {
            setLoading(false)
            if (r.success) {
                setMessage('Parabéns')
                setSuccess(true);
                if (typeof currentItem?.count === 'undefined') setHit((i) => i+1)
            } else {
                setMessage(`O correto seria: ${r.answer}`)
                setSuccess(false);
                if (typeof currentItem?.count === 'undefined') setMiss((i) => i+1)
            }
        })
    }, [currentItem])
    
    return !finished 
    ? currentItem && <div className="m-auto mt-5 w-[800px] max-w-[95%] border bg-slate-400 p-4 rounded-lg">
        <div className="flex mb-2">
            <div className="flex-1"><b>Restantes</b>: {items.length}</div>
            <div className="flex-1"><b>Acertos</b>: {hit}</div>
            <div className="flex-1"><b>Erros</b>: {miss}</div>
            <div className="flex-1"><b>Tempo</b>: <Time updateFinalTime={updateFinalTime} /></div>
        </div>
        <div className="flex justify-center">
            <Image src={`${currentItem.identifier}`} alt="Item image" width={800} height={800}/>
        </div>
        <div className={`mt-3 mb-3 font-medium text-center ${success ? 'text-green-700' : 'text-red-700'}`}>{message}</div>
        <div className="flex gap-4">
            <input disabled={!!message || loading} className="p-2 rounded-md w-full bg-slate-100 text-sm" placeholder="Digite aqui sua resposta" value={val} onInput={(e) => setVal(e.currentTarget.value)} onKeyUp={(e) => {
                if (e.code.includes('Enter')) correct(val)
            }} />
            {!message && <div onClick={() => {
                if (!loading) correct(val)
            }} className={`flex ${loading ? 'bg-slate-500 pointer-events-none' : 'hover:bg-green-800 bg-green-700'} items-center pl-5 pr-5 rounded-md text-white font-bold text-sm transition-colors cursor-pointer`}>
                <span>Corrigir</span>
            </div>}
            {message && <div onClick={() => next(items, true)} className={`flex ${!success ? 'bg-red-700' : 'bg-blue-500'} items-center pl-5 pr-5 rounded-md text-white font-bold text-sm ${!success ? 'hover:bg-red-800' : 'hover:bg-blue-600'} transition-colors cursor-pointer`}>
                <span className="whitespace-nowrap">{success ? 'Próximo' : 'Ignorar Erro'}</span>
            </div>}
            {!success && message && <div onClick={() => next(items, false)} className="flex bg-blue-500 items-center pl-5 pr-5 rounded-md text-white font-bold text-sm hover:bg-blue-600 transition-colors cursor-pointer">
                <span className="whitespace-nowrap">Tentar Novamente</span>
            </div>}
        </div>
    </div> 
    : <div className="text-center text-slate-700 text-6xl mt-20">
        <div>Finished!!!</div>
        <div className="flex mb-2 w-1/3 text-base m-auto mt-8">
            <div className="flex-1"><b>Acertos</b>: {hit}</div>
            <div className="flex-1"><b>Erros</b>: {miss}</div>
            <div className="flex-1"><b>Tempo</b>: {finalTime}</div>
        </div>
    </div>
}

function Time({updateFinalTime}: {updateFinalTime: (s: string) => void}) {
    const [initialTime] = useState(new Date())
    const [time, setTime] = useState("00:00")

    useEffect(() => {
        const d = setInterval(() => {
            const diff = Date.now() - initialTime.getTime()

            setTime(Math.floor((Math.floor((diff) / 1000) / 60)).toString().padStart(2, '0')+":"+(Math.floor((diff) / 1000) % 60).toString().padStart(2, '0'))
        }, 250);
        return () => {
            clearInterval(d);
            updateFinalTime(time)
        }
    })

    return <span>{time}</span>
}
