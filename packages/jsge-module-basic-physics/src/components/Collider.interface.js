
const Collider = (Base) => class extends Base {
    constructor({initiator = false, ...params} = {}) {
        super({...params});
        this._collider = true;

        // Determines if this is the collider that initiates handling the collision
        this.initiator = initiator;
        // Callback scripts
        this._callback = [];

    }

    _init() {
        if (super._init) super._init();
    }
}

export default Collider;