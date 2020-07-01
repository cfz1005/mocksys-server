const project = require("../controller/project");
const interface = require("../controller/interface");
const crypt = require("../utils/crypt");
const users = require("../controller/users");
const logs = require("../controller/logs");
const response = require("../utils/response");

const router = {
    add: async (ctx, next) => {
        let { project_name, project_desc } = ctx.request.body;
        if (!project_name) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res_cf = await project.getCountByUidAndName({
                uid: ctx.state.user.uid,
                project_name
            });
            if (res_cf[0].count) {
                return response.error(ctx, "你已经存在同名项目");
            }

            let res = await project.add({
                uid: ctx.state.user.uid,
                project_name,
                project_desc
            });
            if (res.insertId) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: res.insertId,
                    title: "创建项目"
                });

                return response.success(ctx, { id: res.insertId });
            }
            return response.error(ctx, "创建失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    update: async (ctx, next) => {
        let { id, project_name, project_desc } = ctx.request.body;
        if (!id || !project_name) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res_cf = await project.getCountByUidAndName({
                uid: ctx.state.user.uid,
                project_name,
                id
            });
            if (res_cf[0].count) {
                return response.error(ctx, "你已经存在同名项目");
            }

            let res = await project.update({
                id,
                project_name,
                project_desc
            });
            if (res.affectedRows) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: id,
                    title: "修改项目"
                });

                return response.success(ctx, { id });
            }
            return response.error(ctx, "修改失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    delete: async (ctx, next) => {
        let { id } = ctx.request.body;
        if (!id || !Number.isInteger(+id)) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res_cf = await project.getModelById(parseInt(id));
            if (!res_cf.length || res_cf[0].uid != ctx.state.user.uid) {
                // return response.error(ctx, "只有项目创建者才能执行此操作");
                return response.error(ctx, "对不起，你没有权限删除");
            }

            let res = await project.updateStatus({
                id,
                status: 2
            });
            if (res.affectedRows) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: id,
                    title: "删除项目"
                });

                return response.success(ctx, { id });
            }
            return response.error(ctx, "删除失败");
        } catch (error) {
            ctx.throw(500);
        }
    },
    updateOwner: async (ctx, next) => {
        let { id, to_username, from_password } = ctx.request.body;
        if (!id || !to_username || !from_password) {
            return response.error(ctx, "参数有误");
        }

        try {
            // 1
            let res = await users.getRowByUserName(to_username);
            if (!res.length) {
                return response.error(ctx, "该用户不存在");
            } else if (res[0].id === ctx.state.user.uid) {
                return response.error(ctx, "该项目就是你的，无需转让");
            }
            // 2
            let res_my = await users.getRowById(ctx.state.user.uid);
            const checkpwd = crypt.decrypt(from_password, res_my[0].password);
            if (!checkpwd) {
                return response.error(ctx, "登陆密码有误");
            }

            // 3
            let res_up = await project.updateOwner({
                id,
                uid: res[0].id
            });
            if (res_up.affectedRows) {
                // 把接收者从项目成员中删掉（目前接收者已经是项目所有者）
                await project.deleteProjectMemberByUid({
                    uid: res[0].id,
                    projectid: id
                });
                // 把自己变成项目成员
                await project.addProjectMember({
                    uid: ctx.state.user.uid,
                    projectid: id,
                    role: 1
                });
                // 日志
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: id,
                    title: "项目转让",
                    content: "把项目转让给了" + to_username + "(" + res[0].id + ")"
                });

                return response.success(ctx, { id });
            } else {
                return response.error(ctx, "转让失败");
            }
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
            let res = await project.getModelById(parseInt(id));
            let res_member = await project.getProjectMemberList(parseInt(id));
            let data = {
                project: res[0],
                member: res_member
            };
            return response.success(ctx, data);

        } catch (error) {
            ctx.throw(500);
        }

    },
    getMyList: async (ctx, next) => {
        // return response.success(ctx, ctx.state.user.uid);
        try {
            let res = await project.getListByUid(ctx.state.user.uid);

            // 添加了返回最近的一次操作日志
            // 注意map内部是异步操作，需要等全部执行完再response，所以加了Promise.all
            if (res.length) {
                await Promise.all(
                    res.map(async (item) => {
                        let res_log = await logs.getModelBySubjectIdLastTime({ subjectid: item.id });
                        res_log.length && (item = Object.assign(item, { logs: res_log[0] }));
                    })
                )
            }

            return response.success(ctx, res);
        } catch (error) {
            ctx.throw(500);
        }
    },
    getJoinList: async (ctx, next) => {
        try {
            let res = await project.getListByJoin(ctx.state.user.uid);

            // 添加了返回最近的一次操作日志
            // 注意map内部是异步操作，需要等全部执行完再response，所以加了Promise.all
            if (res.length) {
                await Promise.all(
                    res.map(async (item) => {
                        let res_log = await logs.getModelBySubjectIdLastTime({ subjectid: item.projectid });
                        res_log.length && (item = Object.assign(item, { logs: res_log[0] }));
                    })
                )
            }

            return response.success(ctx, res);
        } catch (error) {
            ctx.throw(500);
        }
    },
    getProjectMemberList: async (ctx, next) => {
        let { id } = ctx.request.query;
        if (!id || !Number.isInteger(+id)) {
            return response.error(ctx, "参数有误");
        }
        try {
            let res = await project.getProjectMemberList(parseInt(id));
            return response.success(ctx, res);
        } catch (error) {
            ctx.throw(500);
        }
    },
    addMember: async (ctx, next) => {
        let { id, username, role } = ctx.request.body;
        if (!id || !username || !role) {
            return response.error(ctx, "参数有误");
        }
        try {
            // 1
            let res = await users.getRowByUserName(username);
            if (!res.length) {
                return response.error(ctx, "该用户不存在");
            } else if (res[0].id === ctx.state.user.uid) {
                return response.error(ctx, "无需添加自己");
            }
            // 2
            let res_my = await project.checkProjectMemberByUid({
                uid: res[0].id,
                projectid: id
            });
            if (res_my.length) {
                return response.error(ctx, "该用户已是项目成员，无需重复添加");
            }

            // 3
            let res_add = await project.addProjectMember({
                uid: res[0].id,
                projectid: id,
                role
            });
            if (res_add.insertId) {
                // 4
                let res_info = await project.getProjectMemberById(res_add.insertId);

                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: id,
                    title: "添加项目成员",
                    content: "新成员uid=" + username + "(" + res[0].id + ")"
                });

                // return response.success(ctx, { id: res_add.insertId });
                return response.success(ctx, res_info[0]);
            } else {
                return response.error(ctx, "添加成员失败");
            }
        } catch (error) {
            ctx.throw(500);
        }
    },
    getInterfaceList: async (ctx, next) => {
        let { id } = ctx.params;
        if (!id || !Number.isInteger(+id)) {
            return response.error(ctx, "参数有误");
        }
        try {
            let res_ck1 = await project.getModelById(id);
            if (!res_ck1.length) {
                return response.json(ctx, "", 404, "该项目不存在");
            }
            let res_ck2 = await project.checkProjectMemberByUid({
                uid: ctx.state.user.uid,
                projectid: id
            });
            if (res_ck1[0].uid != ctx.state.user.uid && !res_ck2.length) {
                return response.json(ctx, "", 404, "对不起，你没有权限访问");
            }

            let res = await interface.getListByProjectId(id);
            let data = {
                project: res_ck1[0],
                interface: res
            };
            data.project.role = res_ck1[0].uid == ctx.state.user.uid ? 1 : res_ck2[0].role; // 加入权限字段再返回
            return response.success(ctx, data);
        } catch (error) {
            ctx.throw(500);
        }
    },
    deleteProjectMemberByUid: async (ctx, next) => {
        let { uid, projectid } = ctx.request.body;
        if (!uid || !Number.isInteger(+uid) || !projectid || !Number.isInteger(+projectid)) {
            return response.error(ctx, "参数有误");
        }

        try {
            let res = await project.deleteProjectMemberByUid({
                uid,
                projectid
            });
            if (res.affectedRows) {
                await logs.add({
                    uid: ctx.state.user.uid,
                    subjectid: projectid,
                    title: "删除项目成员",
                    content: "删除了uid=" + uid + "的用户"
                });

                return response.success(ctx, "删除成功");
            } else {
                return response.error(ctx, "删除失败");
            }
        } catch (error) {
            ctx.throw(500);
        }
    }
}

module.exports = router;