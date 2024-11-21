"use server"

import { ResultSetHeader, RowDataPacket } from "mysql2";
import { mysqlConn } from "../database/mysql"
import { minioClient } from "../storage/minio";
import { toSHA256 } from "@/commons/crypto";

export interface Item { id: number; identifier: string }
export interface FullItem { id: number; identifier: string; answers: Array<{id: number; text: string}> }

export async function Items(collectionId: number): Promise<Item[]> {
    const conn = await mysqlConn()

    const [result] = await conn.query('SELECT ImageId id, ImageIdentifier identifier FROM Anatomy.CollectionImages WHERE ImageCollection = ? AND ImageAnswers > 0;', [collectionId])

    return result as Item[]
}

export async function FullItems(collectionId: number): Promise<FullItem[]> {
    const conn = await mysqlConn()

    const [result] = await conn.query<RowDataPacket[]>(`SELECT ImageId id, ImageIdentifier identifier, (SELECT json_arrayagg(json_object('id', AnswerId, 'text', AnswerText)) FROM Anatomy.Answers WHERE AnswerImage = ImageId) answers FROM Anatomy.CollectionImages WHERE ImageCollection = ? ORDER BY ImageId DESC;`, [collectionId]);

    return result as FullItem[]
}

function normalizeText(t: string) {
    let a = t.toLocaleLowerCase()
    a = a.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    a.replaceAll('-', ' ')
    a.replaceAll('  ', ' ')
    a.replaceAll('a. ', 'a ')
    a.replaceAll('m. ', 'm ')
    a.replaceAll('v. ', 'v ')
    a.replaceAll('n. ', 'n ')

    return a.trim()
}
export async function checkAnswer(collection: number, id: number, text: string) {
    const conn = await mysqlConn()

    const [result] = await conn.query<RowDataPacket[]>("SELECT AnswerId id, AnswerText text FROM Anatomy.Answers WHERE AnswerImage = ? AND AnswerCollection = ?;", [id, collection]);

    const normalized = normalizeText(text)

    let success = false
    result.forEach((answer) => {
        if (normalizeText(answer.text) === normalized) success = true;
    })

    return { success, answer: result[0].text };
}

export async function addAnswer(coll: number, id: number, text: string) {
    const conn = await mysqlConn()

    try {
        const result = await conn.query<ResultSetHeader>("INSERT INTO `Anatomy`.`Answers` (`AnswerCollection`, `AnswerImage`, `AnswerText`) VALUES (?, ?, ?);", [coll, id, text]);
        return { success: true, id: result[0].insertId };
    } catch(e) {
        console.log(e)
        return {success: false };
    } 
}

export async function removeAnswer(id: number) {
    const conn = await mysqlConn()

    try {
        await conn.query(`DELETE FROM Anatomy.Answers WHERE AnswerId = ?;`, [id]);
        return true;
    } catch(e) {
        console.log(e)
        return false;
    } 
}

export async function newImageFile(collection: number, buffer: ArrayBuffer) {
    const bucket = 'collection'+collection;

    const minio = await minioClient()

    if(!await minio.bucketExists(bucket)) await minio.makeBucket(bucket)

    const key = toSHA256('image'+Date.now()+'-'+Math.random()+'-'+Math.random()+'-'+Math.random())

    try {
        await new Promise((resolve, reject) => {
            minio.putObject(bucket, key, Buffer.from(buffer), buffer.byteLength, function (err: unknown, objInfo: unknown) {
                if (err) {
                    return reject(err)
                }
                resolve(objInfo)
            })
        })

        const conn = await mysqlConn()

        await conn.query('INSERT INTO `Anatomy`.`CollectionImages` (`ImageCollection`, `ImageIdentifier`) VALUES (?, ?);', [collection, key])

        return {success: true, message: 'OK'}
    } catch(e) {
        console.log(e)
        
        return {success: false, message: 'Erro do servidor'}
    }
}