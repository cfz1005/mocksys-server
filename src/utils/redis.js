const config = require("../config");
const logs = require("./logs");
const redis = require("redis");

const client = redis.createClient(config.redis.port, config.redis.host);

client.on("error", (err) => {
    console.log("redis error：", err);
    logs.write(err);
});

client.on("connect", () => {
    console.log("redis连接成功");
});


let db = {
    /**
     * 
     * @param {string} key 键
     * @param {string} value 值
     * @param {int} expire 过期时间，单位秒；放空表示不过期
     */
    set(key, value, expire) {
        return new Promise((resolve, reject) => {
            client.set(key, value, (err, res) => {
                if (err) {
                    console.log(err);
                    log.write(err);

                    // callback(err, null);
                    // return;
                    // reject(err);
                    reject("err");
                }

                if (expire && !isNaN(expire)) {
                    client.expire(key, expire);
                }

                // callback(null, res);
                resolve(res);
            });
        });
    },
    /**
     * 
     * @param {string} key 键
     */
    get(key) {
        return new Promise((resolve, reject) => {
            client.get(key, (err, res) => {
                if (err) {
                    // console.log(err);
                    // logs.write(err);

                    // callback(err, null);
                    // return;
                    // reject(err);
                    reject("err");
                }

                // callback(null, res);
                resolve(res);
            });
        });
    }
}


// 导出
module.exports = db;