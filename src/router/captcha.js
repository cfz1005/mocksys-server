const svgCaptcha = require("svg-captcha");

let captcha = async(ctx,next)=>{
    try {
        let config = {
            size:4, // 验证码长度
            ignoreChars:"0o1i", // 验证码字符中排除 0o1i
            noise:1, // 干扰线条的数量
            height:50
        }
        let res = svgCaptcha.create(config);
        ctx.session.captcha = res.text.toLowerCase(); // 存到session中用于接口验证
        ctx.type = "image/svg+xml";
        ctx.body = res.data;
    } catch (error) {
        ctx.throw(500);
    }
}

module.exports = captcha;