module.exports = {
    json: async (ctx, data, code = 200, message = "success") => {
        ctx.body = {
            code,
            message,
            data
        }
    },
    success: async (ctx, data) => {
        ctx.body = {
            code: 200,
            message: "success",
            data
        }
    },
    error: async (ctx, message) => {
        ctx.body = {
            code: 401,
            message: message
        }
    }
}