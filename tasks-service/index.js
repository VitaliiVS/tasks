const Koa = require('koa')
const cors = require('@koa/cors')
const Router = require('koa-router')
const BodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const ObjectID = require("mongodb").ObjectID

const app = new Koa()
const router = new Router()

app.use(cors())
app.use(logger())
app.use(BodyParser())
require('./mongo')(app)

router.get("/tasks", async (ctx) => {
    ctx.status = 200
    ctx.body = await ctx.app.tasks.find().toArray()
})

router.post("/tasks", async (ctx) => {
    await ctx.app.tasks.insertOne(ctx.request.body)
    ctx.status = 201
    ctx.body = await ctx.app.tasks.find().toArray()
})

router.get("/tasks/:id", async (ctx) => {
    ctx.status = 200
    ctx.body = await ctx.app.tasks.findOne({ "_id": ObjectID(ctx.params.id) })
})

router.put("/tasks/:id", async (ctx) => {
    const documentQuery = { "_id": ObjectID(ctx.params.id) }
    const valuesToUpdate = { $set: ctx.request.body }
    await ctx.app.tasks.updateOne(documentQuery, valuesToUpdate)
    ctx.status = 200
    ctx.body = await ctx.app.tasks.find().toArray()
})

router.delete("/tasks/:id", async (ctx) => {
    const documentQuery = { "_id": ObjectID(ctx.params.id) }
    await ctx.app.tasks.deleteOne(documentQuery)
    ctx.status = 200
    ctx.body = await ctx.app.tasks.find().toArray()
})

app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)