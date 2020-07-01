const query = require("../utils/mysql");

let token = {
    add: (value) => {
        return query("INSERT INTO tokens(val) values(?)", [value]);
    },
    getModelByValue: (value) => {
        return query(`SELECT * FROM tokens WHERE val=?`, [value]);
    },
    delete: (value) => {
        return query(`DELETE FROM tokens WHERE val=?`, [value]);
    }


}


module.exports = token;