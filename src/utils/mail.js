const nodemailer = require("nodemailer");

let sendMail = async({tomail,subject,html})=>{
    // 创建发送邮件的对象
    let transporter = nodemailer.createTransport({
        //node_modules/nodemailer/lib/well-known/services.json  查看相关的配置，如果使用qq邮箱，就查看qq邮箱的相关配置
        host: "smtp.exmail.qq.com",
        port: 25,
        secure: false, // true for 465, false for other ports
        auth: {
            //发送者邮箱
            user: '你的邮箱', // generated ethereal user
            //pass 不是邮箱账户的密码而是stmp的授权码（必须是相应邮箱的stmp授权码）
            //邮箱---设置--账户--POP3/SMTP服务 开启--成功开启POP3/SMTP服务,在第三方客户端登录时，密码框请输入以下授权码：
            pass: '授权码'
        }
    });
    
    // 邮件的相关信息
    let msg = {
        //发送者邮箱
        from: 'MockSys <xxx@xx.com>', // sender address
        //接收者邮箱，多个邮箱用逗号间隔
        to: tomail, // list of receivers
        //邮件标题
        subject: subject, 
        //文件内容，发送文件是text格式或者html格式，二者只能选择一个
        // text: "Hello world?", // plain text body
        html: html
    }

    // 发送邮件
    return new Promise((resolve,reject)=>{
        transporter.sendMail(msg, (err, res) => {
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    }); 

}

module.exports = sendMail;
