/**
 * Stores serializable types
 */

import {defaultSerializer} from "./Serialize";
import {defaultDeserializer, defaultStateUpdater} from "./Deserialize";
import { getKeys } from "./common";

const serialTypes = new Map(); // Stores all serializable types with functions to handle them

export type AddSerializableTypeParameters = {
    classRef: any;
    serializer: Function;
    deserializer: Function;
    stateUpdater: Function;
    typename: string;
    keys: string[];
}

export function addSerializableType({
    classRef, 
    serializer, 
    deserializer,
    stateUpdater, 
    typename, 
    keys
}: AddSerializableTypeParameters) {
    if (!typename) {
        // Use Class constructor name
        typename = classRef.name;
        console.warn("[SERIALIZATION]: Warning: Using class constructor names is unsafe!");
    }
    if (!keys) {
        keys = getKeys(classRef, []);
    }
    if (!serializer) {
        serializer = defaultSerializer(keys, false);
    }
    if (!deserializer) {
        deserializer = defaultDeserializer(keys, classRef);
    }
    if (!stateUpdater) {
        stateUpdater = defaultStateUpdater;
    }
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
        console.log(`Enrolled Serializable Type [${typename}: ${keys.join(", ")}]`);
    }
}

export function getSerializableType(typename: string) {
    return serialTypes.get(typename) || null;
}
