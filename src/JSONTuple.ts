import {JSONValue} from './JSONValue';

export class JSONTuple {

    constructor(private key: string, private value: JSONValue) {}

    public getKey(): string {
        return this.key;
    }

    public getValue(): JSONValue {
        return this.value;
    }

}
