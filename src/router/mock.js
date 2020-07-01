const Mock = require("mockjs");
const logs = require("../controller/logs");
const interface = require("../controller/interface");

const router = {
    /**
     * 精确匹配
     * 通过projectid + method + url匹配
     */
    analysis: async (ctx, next) => {
        const { projectid, method, url } = ctx.params;
        let res = await interface.getModelByUrlAndProjectIdAndMethod({ url, projectid, method });
        if (!res.length) {
            // ctx.body = "404 Not Found";
            ctx.body = { message: "404 Not Found" };
            return next();
        }
        // else if (res[0].method.toUpperCase() != ctx.method.toUpperCase()) {
        //     ctx.body = "未匹配到接口，请检查请求类型是否正确~";
        //     return next();
        // }
        try {
            let data = Mock.mock(JSON.parse(res[0].content.replace(/\\'/g, "'")));
            ctx.body = data;
            return next();
        } catch (error) {
            ctr.throw(500);
        }
    },
    /**
     * 模糊匹配
     * 通过interfaceid匹配
     */
    analysis2: async (ctx, next) => {
        const { interfaceid } = ctx.params;
        let res = await interface.getModelById(interfaceid);
        if (!res.length) {
            // ctx.body = "404 Not Found";
            ctx.body = { message: "404 Not Found" };
            return next();
        } else if (res[0].method.toUpperCase() != ctx.method.toUpperCase()) {
            // ctx.body = "未匹配到接口，请检查请求类型是否正确~";
            ctx.body = { message: "未匹配到接口，请检查请求类型是否正确" };
            return next();
        }
        try {
            let data = Mock.mock(JSON.parse(res[0].content.replace(/\\'/g, "'")));
            ctx.body = data;
            return next();
        } catch (error) {
            ctr.throw(500);
        }
    }
}


module.exports = router;