/**
 * Decorators used for handling routers and routing
 */

import express, { Router as RouterClass } from "express";
import { getRouterProperties, registerRouter } from "../internals/routerTracker"
import { HTTPRouteHandlerParams, HTTPRouterProperties, HTTP_METHODS } from "../types";
import { config } from "../../../config";
import { logger } from "../../../logger";
import { HTTPError } from "../errors/http.error";
import { HTTPRouterHandlerParamTypes } from "../types/httpRouteHandlerParamTypes.enum";
import { httpRouterDefaults } from "../defaults/httpRouterDefaults";

export type RouteableClass = {
    __router: RouterClass;
    __path: string;
};

export function Router(path: string): Function {
    // note that this should be called after routes are registered
    return (target: any, propertyKey: string) => {
        let properties = getRouterProperties(target);
        if (properties) {
            properties.path = path;
        } else {
            properties = registerRouter(target, {path});
        }

        const router = buildRoutes(properties, target);

        return class RouteableClass extends target {
            __router = router;
            __path = path;
        }
    }
}

export function Route(method: HTTP_METHODS, path: string): Function {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const properties = getRouterProperties(target.constructor);
        if (properties) {
            const key = properties.routes[propertyKey];
            if (key) {
                key.method = method;
                key.path = path;
                key.handler = descriptor.value;
            } else {
                properties.routes[propertyKey] = {
                    name: propertyKey,
                    method,
                    path,
                    handler: descriptor.value,
                    params: []
                };
            }
        } else {
            registerRouter(target.constructor, {
                routes: {
                    [propertyKey]: {
                        name: propertyKey,
                        path,
                        method,
                        handler: descriptor.value,
                        params: []
                    }
                }
            });
        }
    }
}

export function Param(name: string): Function {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const properties = getRouterProperties(target.constructor);
        if (properties) {
            const key = properties.routes[propertyKey];
            if (key) {
                key.params.push({
                    index: parameterIndex,
                    type: HTTPRouterHandlerParamTypes.PARAM,
                    key: name
                });
            } else {
                properties.routes[propertyKey] = {
                    ...httpRouterDefaults,
                    name: propertyKey,
                    params: [{
                        index: parameterIndex,
                        type: HTTPRouterHandlerParamTypes.PARAM,
                        key: name
                    }]
                };
            }
        } else {
            registerRouter(target.constructor, {
                routes: {
                    [propertyKey]: {
                        ...httpRouterDefaults,
                        name: propertyKey,
                        params: [{
                            index: parameterIndex,
                            type: HTTPRouterHandlerParamTypes.PARAM,
                            key: name
                        }]
                    }
                }
            });
        }
    }
}

export function Body(): Function {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const properties = getRouterProperties(target.constructor);
        if (properties) {
            const key = properties.routes[propertyKey];
            if (key) {
                key.params.push({
                    index: parameterIndex,
                    type: HTTPRouterHandlerParamTypes.BODY,
                    key: null,
                });
            } else {
                properties.routes[propertyKey] = {
                    ...httpRouterDefaults,
                    name: propertyKey,
                    params: [{
                        index: parameterIndex,
                        type: HTTPRouterHandlerParamTypes.BODY,
                        key: null
                    }]
                };
            }
        } else {
            registerRouter(target.constructor, {
                routes: {
                    [propertyKey]: {
                        ...httpRouterDefaults,
                        name: propertyKey,
                        params: [{
                            index: parameterIndex,
                            type: HTTPRouterHandlerParamTypes.BODY,
                            key: null
                        }]
                    }
                }
            });
        }
    }
}

export function Request(): Function {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const properties = getRouterProperties(target.constructor);
        if (properties) {
            const key = properties.routes[propertyKey];
            if (key) {
                key.params.push({
                    index: parameterIndex,
                    type: HTTPRouterHandlerParamTypes.REQUEST,
                    key: null,
                });
            } else {
                properties.routes[propertyKey] = {
                    ...httpRouterDefaults,
                    name: propertyKey,
                    params: [{
                        index: parameterIndex,
                        type: HTTPRouterHandlerParamTypes.REQUEST,
                        key: null
                    }]
                };
            }
        } else {
            registerRouter(target.constructor, {
                routes: {
                    [propertyKey]: {
                        ...httpRouterDefaults,
                        name: propertyKey,
                        params: [{
                            index: parameterIndex,
                            type: HTTPRouterHandlerParamTypes.REQUEST,
                            key: null
                        }]
                    }
                }
            });
        }
    }
}

export function Response(): Function {
    return (target: any, propertyKey: string, parameterIndex: number) => {
        const properties = getRouterProperties(target.constructor);
        if (properties) {
            const key = properties.routes[propertyKey];
            if (key) {
                key.params.push({
                    index: parameterIndex,
                    type: HTTPRouterHandlerParamTypes.RESPONSE,
                    key: null,
                });
            } else {
                properties.routes[propertyKey] = {
                    ...httpRouterDefaults,
                    name: propertyKey,
                    params: [{
                        index: parameterIndex,
                        type: HTTPRouterHandlerParamTypes.RESPONSE,
                        key: null
                    }]
                };
            }
        } else {
            registerRouter(target.constructor, {
                routes: {
                    [propertyKey]: {
                        ...httpRouterDefaults,
                        name: propertyKey,
                        params: [{
                            index: parameterIndex,
                            type: HTTPRouterHandlerParamTypes.RESPONSE,
                            key: null
                        }]
                    }
                }
            });
        }
    }
}

export function connectRouter(app: express.Application, instance: any): void {
    const router = (instance as RouteableClass);
    app.use(router.__path, router.__router);

}

function buildRoutes(properties: HTTPRouterProperties, target: any) {
    const router = express.Router();

    for (const key of Object.keys(properties.routes)) {
        const route = properties.routes[key];

        if (!route.handler) continue;

        if (route.method === HTTP_METHODS.GET) {
            router.get(route.path, (req, res) => routeHandler(req, res, route.handler as Function, route.params));
        } else if (route.method === HTTP_METHODS.POST) {
            router.post(route.path, (req, res) => routeHandler(req, res, route.handler as Function, route.params));
        } else if (route.method === HTTP_METHODS.PUT) {
            router.put(route.path, (req, res) => routeHandler(req, res, route.handler as Function, route.params));
        } else if (route.method === HTTP_METHODS.DELETE) {
            router.delete(route.path, (req, res) => routeHandler(req, res, route.handler as Function, route.params));
        }
    }

    return router;
}

async function routeHandler(req: express.Request, res: express.Response, next: Function, params: HTTPRouteHandlerParams[]): Promise<void> {
    if (config.env === "development") {
        logger.debug(`[${req.method}] ${req.path} ${req.params}`);
    }
    const functionParams = [];

    for (const param of params) {
        switch (param.type) {
            case HTTPRouterHandlerParamTypes.BODY:
                functionParams.push(req.body);
                break;
            case HTTPRouterHandlerParamTypes.PARAM:
                functionParams.push(req.params[param.key as string]);
                break;
            case HTTPRouterHandlerParamTypes.REQUEST:
                functionParams.push(req);
                break;
            case HTTPRouterHandlerParamTypes.RESPONSE:
                functionParams.push(res);
                break;
        }
    }

    try {
        const data = await next(...functionParams);
        res.json(data);
    } catch (error) {
        console.error(error);
        if (error instanceof HTTPError) {
            if (error.httpCode >= 500) {
                logger.error(`HTTP Error ${req.path} ${
                    JSON.stringify(error)
                }`);
            } else if (config.env === "development") {
                logger.warn(`HTTP Error caught ${req.path} ${JSON.stringify(error)}`);
            }
            res.status(error.httpCode).json({
                httpCode: error.httpCode,
                code: error.code,
                message: error.message,
                trace: config.env === "development" ? error.stack : undefined,
                error: config.env === "development" ? JSON.stringify(error) : undefined
            });
            return;
        } 
        logger.error(`Uncaught error ${req.path} ${
            JSON.stringify(error)
        }`);
        res.status(500).json({
            httpCode: 500,
            code: "Internal server error",
            error: config.env === "development" ? JSON.stringify(error) : undefined
        });
        return;
    }
}