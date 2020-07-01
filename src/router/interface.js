const project = require("../controller/project");
const interface = require("../controller/interface");
const logs = require("../controller/logs");
const response = require("../utils/response");

const router = {
    add: async (ctx, next) => {
        let { projectid, method, url, description, content } = ctx.request.body;
        if (!projectid || !Number.isInteger(+projectid) || !method || !url || !content) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res_ck1 = await project.getModelById(projectid);
            let res_ck2 = await project.checkProjectMemberByUid({
                uid: ctx.state.user.uid,
                projectid: projectid
            });
            if ((!res_ck1.length || res_ck1[0].uid != ctx.state.user.uid) && (!res_ck2.length || res_ck2[0].role == 2)) {
                return response.error(ctx, "对不起，你没有权限操作该项目上创建接口");
            }
            let res_ck3 = await interface.getModelByUrlAndProjectIdAndMethod({ url, projectid, method });
            if (res_ck3.length) {
                return response.error(ctx, "该项目中已经存在同名URL，请修改");
            }
            let res = await interface.add({
                uid: ctx.state.user.uid,
                projectid,
                method,
                url,
                description,
                content
            });
            if (res.insertId) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: projectid,
                    title: "添加一个接口",
                    content: "[" + method + "] " + url
                });

                return response.success(ctx, { id: res.insertId });
            }
            return response.error(ctx, "创建失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    update: async (ctx, next) => {
        let { id, projectid, method, url, description, content } = ctx.request.body;
        if (!id || !Number.isInteger(+id) || !projectid || !method || !url || !content) {
            return response.error(ctx, "参数有误");
        }

        let res_ck3 = await interface.getModelByUrlAndProjectIdAndMethod({ url, projectid, method });
        if (res_ck3.length && res_ck3[0].id != id) {
            return response.error(ctx, "该项目中已经存在同名URL，请修改");
        }

        try {
            let res = await interface.update({
                id,
                method,
                url,
                description,
                content
            });
            if (res.affectedRows) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: projectid,
                    title: "修改一个接口",
                    content: "ID="+id
                });

                return response.success(ctx, { id });
            }
            return response.error(ctx, "修改失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    delete: async (ctx, next) => {
        let { id, projectid } = ctx.request.body;
        if (!id || !Number.isInteger(+id) || !projectid || !Number.isInteger(+projectid)) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res_ck1 = await project.getModelById(projectid);
            let res_ck2 = await project.checkProjectMemberByUid({
                uid: ctx.state.user.uid,
                projectid: projectid
            });
            if ((!res_ck1.length || res_ck1[0].uid != ctx.state.user.uid) && (!res_ck2.length || res_ck2[0].role == 2)) {
                return response.error(ctx, "对不起，你没有权限删除该接口");
            }

            let res = await interface.delete(id);
            if (res.affectedRows) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: projectid,
                    title: "删除一个接口",
                    content: "ID="+id
                });

                return response.success(ctx, { id });
            }
            return response.error(ctx, "删除失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    getModelById: async (ctx, next) => {
        let { id } = ctx.request.query;
        if (!id || !Number.isInteger(+id)) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res = await interface.getModelById(id);
            if (!res.length) {
                return response.json(ctx, "", 404, "找不到这条记录");
            } else {
                let res_ck = await project.checkProjectMemberByUid({
                    uid: ctx.state.user.uid,
                    projectid: res[0].projectid
                });
                if ((!res_ck.length || res_ck[0].role == 2) && res[0].uid != ctx.state.user.uid) {
                    return response.json(ctx, "", 404, "对不起，你没有权限操作该接口");
                }
            }

            return response.success(ctx, res[0]);
        } catch (error) {
            ctx.throw(500);
        }
    },
}

module.exports = router;