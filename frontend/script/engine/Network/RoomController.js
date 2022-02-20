/**
 * Communicates with the Rooms API part of the Websocket Server
 */

export async function createRoom(baseURL, payload) {
    console.log(payload)
    const resp = await fetch(`${baseURL}/api/rooms`, {
        method: "POST",
        mode: "cors",
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
        mode: "cors",
        headers: {
            'Content-Type': "application/json"
        }
    });
    console.log(resp.body);
    let json = await resp.json();

    if (json.dataset) {
        return json.dataset;
    } else {
        return json;
    }
}