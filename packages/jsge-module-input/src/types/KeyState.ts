export type KeyState = {
    // Raw values from input submodule
    rawValue: number,
    maxValue: number,
    minValue: number,
    // calculated value based on above values and modifier
    value: number
}