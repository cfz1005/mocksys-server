const request = require("request");
const response = require("../utils/response");

const router = {
    // https://github.com/yuzhiyi/BingWallpaper/blob/master/index.js
    getimg: async (ctx, next) => {
        let index = Math.floor(Math.random() * 8); // 0;
        let perpage = 8;
        await new Promise((resolve, reject) => {
            request.get(
                `http://cn.bing.com/HPImageArchive.aspx?format=js&idx=${index}&n=${perpage}&mkt=zh-CN`,
                function (err, res, body) {
                    if (err) {
                        reject(err);
                    }
                    const data = JSON.parse(body);
                    resolve(data);
                }
            );
            // bing api参数说明：
            // format 参数为返回的数据格式，目前已知支持xml以及json
            // idx 参数为日期偏移量，0为今天的图片，1为昨天，2为前天，以此类推，取值0~7
            // n 参数为返回的图片数量，取值1~8
        }).then(res => {
            let randimg = "https://cn.bing.com"; //"https://www.bing.com";
            if (res.images.length) {
                let item = res.images[Math.floor(Math.random() * res.images.length)];
                randimg += item.url;
            }
            return response.success(ctx, randimg);
        }).catch(err => {
            return response.error(ctx, err);
        });
    }
}


module.exports = router;