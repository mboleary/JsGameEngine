import { Router } from "express";
import { HTTP_METHODS } from "./httpMethods.enum"
import { HTTPRouterHandlerParamTypes } from "./httpRouteHandlerParamTypes.enum";

export type HTTPRouterProperties = {
    // Main router path
    path: string,
    // Express router instance
    // router: Router,
    // routes that need to be connected
    routes: {[key: string]: HTTPRoute};
}

export type HTTPRoute = {
    // name of function
    name: string,
    // path of route
    path: string,
    // HTTP method to listen for
    method: HTTP_METHODS | null,
    // handler function for the route to use
    handler: Function | null,
    params: HTTPRouteHandlerParams[]
}

export type HTTPRouteHandlerParams = {
    index: number,
    type: HTTPRouterHandlerParamTypes | null,
    key: string | null,
}