const query = require("../utils/mysql");
const moment = require("moment");

let users = {
    // 通过账号获取用户信息
    getRowByUserName: (username) => {
        return query(`SELECT * FROM users WHERE username=?`, [username]);
    },
    // 通过uid获取用户信息
    getRowById: (id) => {
        return query(`SELECT * FROM users WHERE id=?`, [id]);
    },
    // 新增一个用户（注册）
    addUser: ({ username, password, nickname }) => {
        return query(`
            INSERT INTO 
            users(username,password,nickname,status,avatar,addtime) 
            VALUES(?,?,?,?,?,?)
        `,
            [username, password, nickname, 1, avatar[Math.floor(Math.random() * avatar.length)] + ".png", moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        );
    },
    // 通过账号修改密码（重置密码/找回密码 & 修改密码）
    updatePasswordByUserName: (username, new_password) => {
        return query(`UPDATE users SET password=? WHERE username=?`, [new_password, username]);
    }

}


module.exports = users;



let avatar = [
    "0ca2acd8d8a86f30",
    "4eb87eb013e9563d",
    "4fa24cbb8922c4d3",
    "7ea1956c558384e0",
    "8a03a602592491df",
    "30c141a717bb36b",
    "64aa15de78d1be1f",
    "79f5ddc5da13a528",
    "935c23225d3d97d9",
    "702104e0070c2f52",
    "16908441d801fb5b",
    "a6908b1760bd4373",
    "a954566b081caf86",
    "b2a364b8ea8e1b5f",
    "c0b738dba8b09d17",
    "c30335326047ae73",
    "d608d43b3185e19b",
    "de1e180de41dbbb3",
    "e485349ca8db9cb5",
    "ec2fca758a2c7bfea"
];