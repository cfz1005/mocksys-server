// 1
// const router = require("koa-router")();
const router = require("koa-router")({ prefix: "/api/v1" });
// 2
const captcha = require("./captcha");
const users = require("./users");
const project = require("./project");
const interface = require("./interface");
const bing = require("./bing");
const mock = require("./mock");

// 3
router.get("/captcha", captcha);
router.post("/users/login", users.login);
router.post("/users/logout", users.logout);
router.post("/users/register", users.register);
router.post("/users/getpwd", users.getpwd);
router.get("/users/getuserinfo", users.getuserinfo);

router.post("/project/add", project.add);
router.post("/project/update", project.update);
router.post("/project/delete", project.delete);
router.post("/project/update-owner", project.updateOwner);
router.get("/project/get-mylist", project.getMyList);
router.get("/project/get-joinlist", project.getJoinList);
router.get("/project/get-info", project.getModelById);
router.get("/project/get-memberlist", project.getProjectMemberList);
router.post("/project/add-member", project.addMember);
router.post("/project/delete-member", project.deleteProjectMemberByUid);
router.get("/project/:id(\\d+)", project.getInterfaceList);

router.post("/interface/add", interface.add);
router.post("/interface/update", interface.update);
router.post("/interface/delete", interface.delete);
router.get("/interface/get-info", interface.getModelById);

router.get("/bing/getbg", bing.getimg);

// mock接口相关
// 精确匹配
// router.get("/mock/:projectid(\\d+)/:method(get|post|put|delete)/:url(\\S+)", mock.analysis);
router.get("/mock/:projectid(\\d+)/:method(get)/:url(\\S+)", mock.analysis);
router.post("/mock/:projectid(\\d+)/:method(post)/:url(\\S+)", mock.analysis);
router.put("/mock/:projectid(\\d+)/:method(put)/:url(\\S+)", mock.analysis);
router.delete("/mock/:projectid(\\d+)/:method(delete)/:url(\\S+)", mock.analysis);
// id匹配
router.get("/mock/:interfaceid(\\d+)", mock.analysis2);
router.post("/mock/:interfaceid(\\d+)", mock.analysis2);
router.put("/mock/:interfaceid(\\d+)", mock.analysis2);
router.delete("/mock/:interfaceid(\\d+)", mock.analysis2);


// 4
module.exports = () => router.routes();