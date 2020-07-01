const query = require("../utils/mysql");
const moment = require("moment");

let logs = {
    add: ({ uid, type=1, subjectid, title="", content="" }) => {
        return query(`
            INSERT INTO 
            logs(uid, type, subjectid, title, content, addtime) 
            VALUES(?,?,?,?,?,?)
            `,
            [uid, type, subjectid, title, content, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        );
    },
    getModelBySubjectIdLastTime: ({ type=1, subjectid }) => {
        return query(`
            SELECT t1.addtime,t2.nickname FROM 
            logs t1 
            inner join 
            users t2 
            ON t1.uid = t2.id 
            WHERE 
            t1.type = ? and t1.subjectid = ? 
            ORDER BY t1.addtime desc 
            limit 1
            `,
            [type, subjectid]
        );
    }
}

module.exports = logs;