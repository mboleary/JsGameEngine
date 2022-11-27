import { ControlType } from "./ControlType.enum";

import type { KeyMapping } from "./KeyMapping";
import { Direction } from "./Direction.enum";

export type KeyDef = {
    name: string,
    type: ControlType,
    direction: Direction,
    mappings: KeyMapping<any>[]
}