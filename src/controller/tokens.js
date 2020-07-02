const query = require("../utils/mysql");

let token = {
    add: (value,uid) => {
        return query("INSERT INTO tokens(val,uid) values(?,?)", [value,+uid]);
    },
    getModelByValue: (value) => {
        return query(`SELECT * FROM tokens WHERE val=?`, [value]);
    },
    delete: (value) => {
        return query(`DELETE FROM tokens WHERE val=?`, [value]);
    }


}


module.exports = token;