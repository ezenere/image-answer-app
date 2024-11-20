"use server"

import mysql from "mysql2/promise"

const poolConnection = mysql.createPool({
    host: 'mysql',
    user: 'root',
    password: '123456789',
    database: 'Anatomy',
    connectionLimit: 10
});

export async function mysqlConn() {
    return poolConnection
}