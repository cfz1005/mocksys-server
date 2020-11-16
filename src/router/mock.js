const Mock = require("mockjs");
const logs = require("../utils/logs");
const interface = require("../controller/interface");
const { VM } = require("vm2")
const { Safeify } = require("safeify")


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
            // let data = Mock.mock(JSON.parse(res[0].content.replace(/\\'/g, "'")));
            let data = router._MockHandler(ctx, next, res[0].content);
            ctx.body = data;
            return next();
        } catch (error) {
            ctx.throw(500);
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
            // let data = Mock.mock(JSON.parse(res[0].content.replace(/\\'/g, "'")));
            let data = router._MockHandler(ctx, next, res[0].content);
            ctx.body = data;
            return next();
        } catch (error) {
            ctx.throw(500);
        }
    },
    _MockHandler(ctx,next,data) {
        // Mock增强
        Mock.Handler.function = function (options) {
            process.exit = function(){} // 以防操作到主进程
            options.Mock = Mock
            // 传入 request cookies，方便使用
            options._req = ctx.request
            // options._req.params = getParams(mockUrl, reqUrl)
            // options._req.cookies = this.cookies.get.bind(this)
            return options.template.call(options.context.currentContext, options)
        }


        // var mode = `{
        //     code: 200,
        //     data: {
        //         id: 2,
        //         name: '@cname',
        //         fun: function ({ _req }) {
        //             process.exit();
        //             return _req;
        //         }
        //     }
        // }`;

        // let mode = JSON.parse(data);
        let mode = {};
        try {
            mode = JSON.parse(data,(key, val)=>{
                if(val.toString().indexOf("function")>-1){
                    return eval("(function(){return "+val+"})()");
                }
                return val;
            });
        } catch (error) {
            mode = {
                code:401, 
                message:"数据格式有误，解析失败~"
            }
        }

        // vm2方案
        const vm = new VM({
            timeout: 2000,
            sandbox: {
                Mock: Mock,
                template: mode
                // template: new Function('return ' + mode)()
            }
        });
        try {
            return vm.run("Mock.mock(template)");
        } catch (error) {
            logs.write("mock.js -- vm.run()执行出错~");
            return error.message;
        }
        // try {
        //     let data = vm.run("Mock.mock(template)")
        //     ctx.body = data;
        // } catch (error) {
        //     ctx.body = error.message;
        // }


        

        // safeify方案
        // const vm = new Safeify({
        //     timeout: 50,
        //     asyncTimeout: 500,
        //     quantity: 4,
        //     memoryQuota: 500,
        //     cpuQuota: 0.5
        // });
        // const context = {
        //     Mock: Mock,
        //     template: mode
        // }
        // const data = await vm.run(`return Mock.mock(template)`, context);
        // ctx.body = data;




        // 测试方案
        // let data = Mock.mock({
        //     code: 200,
        //     data: {
        //         id: 2,
        //         name: '@cname',
        //         fun: function ({ _req }) {
        //             return _req;
        //         }
        //     }
        // });
        // ctx.body = data;
    }
}


module.exports = router;