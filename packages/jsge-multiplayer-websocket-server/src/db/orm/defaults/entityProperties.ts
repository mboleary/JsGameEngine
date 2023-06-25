import { EntityField } from "../types";

export const entityFieldDefaults: EntityField = {
    name: "",
    type: null,
    nullable: true,
    pk: false,
    readonly: false,
    unique: false,
}