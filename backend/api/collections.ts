"use server"

import { ResultSetHeader, RowDataPacket } from "mysql2"
import { mysqlConn } from "../database/mysql"

export interface Collection { id: number; name: string; description: string; quantity: number; answers: number }

export async function Collections(): Promise<Collection[]> {
    const conn = await mysqlConn()
    
    const [result] = await conn.query<RowDataPacket[]>("SELECT CollectionId id, CollectionName name, CollectionDescription description, CollectionQuantity quantity, CollectionAnswers answers FROM Collections;");

    return result as Collection[];
}

export async function newCollection(name: string, description: string) {
    const conn = await mysqlConn()
    try {
        const [result] = await conn.query<ResultSetHeader>("INSERT INTO `Anatomy`.`Collections` (`CollectionName`, `CollectionDescription`) VALUES (?, ?);", [name, description])

        return { success: true, message: result.insertId }
    } catch (e: unknown) {
        console.log(e)

        return { success: false, message: 'Database Error' }
    }
}