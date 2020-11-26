# Debug UI

The Debug UI is an interface that helps a developer to see what's going on inside of JSGE. It makes it easy to play with GameObjects in the Game, as well as to add new ones, and modify the values of ones that have already been added. DebugUI is an abstract interface, so developers can create their own tools to make use of these features.

## DebugUI and CORS

https://stackoverflow.com/questions/25098021/securityerror-blocked-a-frame-with-origin-from-accessing-a-cross-origin-frame
https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage

Debug UI can come from a different origin, thanks to the use of `postMessage`.

## DebugUI Messages

```json
{
    "type": "GET",
    "data": {
        "from":"engine", // Defaults to getting from window.debug
        "var":["<variable>"]
    }
}
{
    "type": "SET",
    "data": {
        "from":"gameObject",
        "select":"<gameObject ID here>",
        "type": "push", // push, insert, delete, replace
        "var": ["scripts", 12, "blocks", 14, 6],
        "data": "newDataHere"
    }
}
{
    "type": "ACTION",
    "data": {
        "from": "gameObject",
        "select":"<gameObject ID here>",
        "var":["scripts", 12, "blocks", "testFunc"],
        "params":["test1"]
    }
}
```