const query = require("../utils/mysql");
const moment = require("moment");

let project = {
    add: ({ uid, project_name, project_desc }) => {
        return query(`
            INSERT INTO 
            project(uid,project_name,project_desc,status,addtime) 
            VALUES(?,?,?,?,?)
        `,
            [uid, project_name, project_desc, 1, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        );
    },
    update: ({ id, project_name, project_desc }) => {
        return query(`
            UPDATE project SET 
            project_name=?,project_desc=? 
            WHERE id=?
        `,
            [project_name, project_desc, id]
        );
    },
    updateOwner: ({ id, uid }) => {
        return query(`UPDATE project SET uid=? WHERE id=?`, [uid, id]);
    },
    updateStatus: ({ id, status }) => {
        return query(`UPDATE project SET status=? WHERE id=?`, [status, id]);
    },
    getModelById: (id) => {
        return query(`SELECT * FROM project WHERE id=?`, [id]);
    },
    getCountByUidAndName: ({ uid, project_name, id }) => {
        if (!id) {
            return query(`SELECT count(1) as count FROM project WHERE uid=? and project_name=?`, [uid, project_name]);
        } else {
            return query(`SELECT count(1) as count FROM project WHERE uid=? and project_name=? and id !=?`, [uid, project_name, id]);
        }
    },
    getListByUid: (uid) => {
        return query(`SELECT * FROM project WHERE status=1 and uid=?`, [uid]);
    },
    getListByJoin: (uid) => {
        return query(`
            SELECT t1.*,t2.project_name,t2.project_desc 
            FROM project_member t1 
            INNER JOIN project t2 
            ON t1.projectid = t2.id 
            WHERE t2.status=1 and t1.uid = ?
        `,
            [uid]);
    },
    getProjectMemberById: (id) => {
        return query(`
            SELECT t1.*,t2.username,t2.nickname  
            FROM project_member t1 
            INNER JOIN users t2 
            ON t1.uid = t2.id 
            WHERE t1.id = ?
        `,
            [id]);
    },
    getProjectMemberList: (projectid) => {
        return query(`
            SELECT t1.*,t2.username,t2.nickname  
            FROM project_member t1 
            INNER JOIN users t2 
            ON t1.uid = t2.id 
            WHERE t1.projectid = ?
        `,
            [projectid]);
    },
    addProjectMember: ({ uid, projectid, role }) => {
        return query(`
            INSERT INTO 
            project_member(uid,projectid,role,addtime) 
            VALUES(?,?,?,?)
        `,
            [uid, projectid, role, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")]
        );
    },
    deleteProjectMemberById: (id) => {
        return query(`DELETE FROM project_member WHERE id=?`, [id]);
    },
    deleteProjectMemberByUid: ({ uid, projectid }) => {
        return query(`DELETE FROM project_member WHERE uid=? and projectid=?`, [uid, projectid]);
    },
    checkProjectMemberByUid: ({ uid, projectid }) => {
        return query(`SELECT * FROM project_member WHERE uid=? and projectid=?`, [uid, projectid]);
    }
}


module.exports = project;