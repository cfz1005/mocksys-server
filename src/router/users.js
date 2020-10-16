const users = require("../controller/users");
const tokens = require("../controller/tokens");
const crypt = require("../utils/crypt");
const response = require("../utils/response");
const jwt = require("../utils/jwt");
const config = require("../config");
const mail = require("../utils/mail");
const stringrandom = require("string-random");

const router = {
    login: async (ctx, next) => {
        let data = ctx.request.body;
        if (!data.username || !data.password || !data.captcha) {
            return response.error(ctx, "参数有误");
        }
        if (ctx.session.captcha.toLowerCase() !== data.captcha.toLowerCase()) {
            return response.error(ctx, "验证码错误");
        }

        try {
            let res = await users.getRowByUserName(data.username);
            if (res.length > 0) {
                const checkpwd = crypt.decrypt(data.password, res[0].password);
                if (checkpwd) {
                    const token = jwt.sign({ uid: res[0].id });
                    await tokens.add(token,res[0].id);

                    // ctx.cookies.set("token", token, {
                    //     domain: "localhost", // 有效作用域 .xxx.com
                    //     maxAge: 24 * 3600 * 1000, // 有效时长
                    //     httpOnly: true, // 只允许从http请求中获取
                    //     overwrite: false // 不可重写
                    // });

                    return response.success(ctx, { token });
                } else {
                    // response.error(ctx,"密码错误");
                    return response.error(ctx, "用户名或密码错误");
                }
            } else {
                return response.error(ctx, "用户名或密码错误");
            }
        } catch (error) {
            ctx.throw(500);
        }

    },
    logout: async (ctx, next) => {
        try {
            let res = await tokens.delete(ctx.header.token);
            if (res.affectedRows) {
                return response.success(ctx, "退出成功");
            } else {
                return response.error(ctx, "退出失败");
            }
        } catch (error) {
            ctx.throw(500);
        }
    },
    register: async (ctx, next) => {
        let data = ctx.request.body;
        if (!data.username || !data.password || !data.nickname || !data.captcha) {
            return response.error(ctx, "参数有误");
        }
        if (ctx.session.captcha.toLowerCase() !== data.captcha.toLowerCase()) {
            return response.error(ctx, "验证码错误");
        }

        try {
            let res = await users.getRowByUserName(data.username);
            if (res.length > 0) {
                return response.error(ctx, "该账号已经存在");
            } else {
                let add_res = await users.addUser({
                    username: data.username,
                    password: crypt.encrypt(data.password),
                    nickname: data.nickname
                });
                if (add_res.insertId) {
                    const token = jwt.sign({ uid: add_res.insertId });
                    await tokens.add(token);
                    return response.success(ctx, { token });
                } else {
                    return response.error(ctx, "注册失败");
                }
            }
        } catch (error) {
            ctx.throw(500);
        }
    },
    getpwd: async (ctx, next) => {
        let data = ctx.request.body;
        if (!data.username || !data.captcha) {
            return response.error(ctx, "参数有误");
        }
        if (ctx.session.captcha.toLowerCase() !== data.captcha.toLowerCase()) {
            return response.error(ctx, "验证码错误");
        }

        try {
            let res = await users.getRowByUserName(data.username);
            if (res.length > 0) {
                let new_password = stringrandom(6, { letters: false });
                let new_password_crypt = crypt.encrypt(new_password);
                let upd_res = await users.updateUserByUserName(data.username, new_password_crypt);
                if (upd_res.affectedRows) {
                    await mail({
                        tomail: data.username,
                        subject: "找回密码",
                        html: "新密码：<b>" + new_password + "</b>，请妥善保管~"
                    }
                    );
                    return response.success(ctx, "新密码已经发送到你邮箱，请查收~");
                } else {
                    return response.error(ctx, "找回密码失败");
                }
            } else {
                return response.error(ctx, "该账户不存在");
            }
        } catch (error) {
            ctx.throw(500);
        }
    },
    getuserinfo: async (ctx, next) => {
        try {
            res = await users.getRowById(ctx.state.user.uid);
            if (res.length) {
                let avatar_host = config.serverDomain?config.serverDomain:`${config.serverURL}:${ctx.serverPort}`;
                return response.success(ctx, {
                    uid: ctx.state.user.uid,
                    nickname: res[0].nickname,
                    username: res[0].username,
                    avatar: `${avatar_host}/avatar/` + res[0].avatar
                });
            } else {
                return response.error(ctx, "查询不到该用户");
            }
        } catch (error) {
            ctx.throw(500);
        }
    }
}

module.exports = router;