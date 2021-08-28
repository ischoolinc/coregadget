
export class DSAError extends Error {

    constructor(
        message: string,
        public code: string,
        public detail?: any,
    ) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}