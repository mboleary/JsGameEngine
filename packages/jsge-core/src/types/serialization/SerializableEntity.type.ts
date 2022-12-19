export type SerializableEntity = {
    type: string;
    serializer: Function;
    deserializer: Function;
    updater: Function;
    classRef: any;
    keys: string[];
}