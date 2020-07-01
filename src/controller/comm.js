const query = require("../utils/mysql");

let exec = async (sql, values = []) => {
    try {
        return await query(sql, values);
    } catch (error) {
        ctx.throw(500);
    }
}

module.exports = exec;