/**
 * Communicates with the Rooms API part of the Websocket Server
 */

export async function createRoom(baseURL, payload) {
    const resp = await fetch(`${baseURL}/api/rooms`, {
        method: "POST",
        mode: "no-cors",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    });
    return resp.json();
}

export async function getRooms(baseURL) {
    const resp = await fetch(`${baseURL}/api/rooms`, {
        method: "GET",
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(payload)
    });
    return resp.json();
}