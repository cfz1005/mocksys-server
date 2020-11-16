const fs = require("fs");
const path = require("path");

const logs = {
    write: (txt) => {
        let date = new Date();
        let filename = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".txt";
        let filedir = path.resolve(__dirname, "../../logs/" + filename);
        txt = `[${date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()}] ${txt}`;

        fs.access(filedir, (err) => {
            if (err) { // 表示文件不存在
                fs.writeFile(filedir, txt, "utf-8", (err2) => {
                    if (err2) {
                        console.log(err2);
                        return false;
                    } else {
                        return true;
                    }
                })
            } else { // 表示文件存在
                fs.appendFile(filedir, txt + "\n\n", (err2) => {
                    if (err2) {
                        console.log(err2);
                        return false;
                    } else {
                        return true;
                    }
                });
            }
        });
    }
}


module.exports = logs;