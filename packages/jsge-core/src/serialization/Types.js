/**
 * Stores serializable types
 */

const serialTypes = new Map(); // Stores all serializable types with functions to handle them

export function addSerializableType({typename, serializer, deserializer, stateUpdater, classRef, keys} = {}) {
    if (!serialTypes.has(typename)) {
        const obj = {
            type: typename,
            serializer,
            deserializer,
            updater: stateUpdater,
            classRef,
            keys
        };
        serialTypes.set(typename, obj);
    }
}

export function getSerializableType(typename) {
    return serialTypes.get(typename) || null;
}
