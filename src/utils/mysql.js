const mysql = require("mysql");
const config = require("../config");
const logs = require("./logs");

const pool = mysql.createPool({
    host: config.mysql.host,
    port: config.mysql.port,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

let query = (sql, values = []) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, conn) => {
            if (err) {
                logs.write(`错误信息：${err.sqlMessage}`);
                reject(err);
            } else {
                conn.query(sql, values, (err, rows) => {
                    if (err) {
                        logs.write(`错误信息：${err.sqlMessage}，sql语句：${err.sql}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                    conn.release();
                })
            }
        });
    });
}


module.exports = query;
