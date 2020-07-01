const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
const cors = require("koa2-cors");
// const cors = require("./utils/koa-cors");
const path = require("path");
const session = require("koa-session");
// const jwt2 = require("./utils/jwt2");
const jwt = require("./utils/jwt");
const router = require("./router");
const config = require("./config");

const app = new Koa();
// 验证码+session
app.keys = config.keys;
app.use(session(config.session, app));

// app.use(async(ctx)=>{
//     if(ctx.path == "/users/getuserinfo")
//     console.log("33334");
//     else
//     console.log("33335",ctx.header);
// });

// app.use(async(ctx,next)=>{
//     ctx.set("Access-Control-Allow-Origin", "*");
//     ctx.set("Access-Control-Allow-Methods", "OPTIONS, GET, PUT, POST, DELETE");
//     ctx.set("Access-Control-Allow-Headers", "x-requested-with, accept, origin, content-type");
//     await next();
// });
// app.use(async(ctx,next)=>{
//     await next();
//     ctx.type = "application/json";
// });

// app.use(cors); 
app.use(cors({
    credentials: true,
    // origin: ctx => ctx.header.origin
}));



app.use(static(path.resolve(__dirname, "..") + "/public"));
app.use(bodyParser());
app.use(jwt.verify());
app.use(router());


// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
});

app.context.serverPort = config.serverPort;
app.listen(config.serverPort);
console.log(`mockapi-server 启动成功 Local: ${config.serverURL}:${config.serverPort}/`);
