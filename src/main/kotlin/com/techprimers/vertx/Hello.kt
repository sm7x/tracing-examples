package com.techprimers.vertx

import io.vertx.core.Vertx
import io.vertx.core.json.Json
import io.vertx.ext.web.Router

fun main(args: Array<String>) {

    val vertx = Vertx.vertx()
    val httpServer = vertx.createHttpServer()

    val router = Router.router(vertx)

    router.get("/")
            .handler({
                routingContext ->
                val response = routingContext.response()
                response.putHeader("content-type", "text/plain")
                        .setChunked(true)
                        .write("Hi Youtube\n")
                        .end("Ended")
            })

    router.get("/json/:name")
            .handler({
                routingContext ->

                val request = routingContext.request()
                val name = request.getParam("name")
                val response = routingContext.response()
                response.putHeader("content-type", "application/json")
                        .setChunked(true)
                        .write(Json.encodePrettily(ResponseObj("Hello, " + name)))
                        .end()
            })

    router.get("/json/id/:id")
            .handler({
                routingContext ->

                val request = routingContext.request()
                val id = request.getParam("id")
                val response = routingContext.response()
                response.putHeader("content-type", "application/json")
                        .setChunked(true)
                        .write(Json.encodePrettily(ResponseObj("Yo! Number, " + id)))
                        .end()
            })

    httpServer
            .requestHandler(router::accept)
            .listen(8091)
}


data class ResponseObj(var name:String = "")
