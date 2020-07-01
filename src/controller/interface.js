const query = require("../utils/mysql");
const moment = require("moment");

let interface = {
    add: ({ uid, projectid, method, url, description, content }) => {
        return query(`
            INSERT INTO 
            interface(uid, projectid, method, url, description, content, addtime) 
            VALUES(?,?,?,?,?,?,?)
        `,
            [uid, projectid, method.toUpperCase(), url.toLowerCase().trim(), description, content, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        );
    },
    update: ({ method, url, description, content, id }) => {
        return query(`
            UPDATE interface SET  
            method=?, url=?, description=?, content=?  
            WHERE id=?
        `,
            [method, url.toLowerCase().trim(), description, content, id]
        );
    },
    delete: (id) => {
        return query(`DELETE FROM interface WHERE id=?`, [+id]);
    },
    getListByProjectId: (projectid) => {
        return query(`SELECT * FROM interface WHERE projectid = ?`, [projectid]);
    },
    getModelById: (id) => {
        return query(`SELECT * FROM interface WHERE id = ?`, [id]);
    },
    getModelByUrlAndProjectIdAndMethod: ({ url, projectid, method }) => {
        return query(`SELECT * FROM interface WHERE projectid = ? and url=? and method=?`, [projectid, url.toLowerCase().trim(), method.toUpperCase()]);
    },
}

module.exports = interface;