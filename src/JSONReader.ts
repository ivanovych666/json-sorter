import {JSONArray} from './JSONArray';
import {JSONObject} from './JSONObject';
import {JSONTuple} from './JSONTuple';
import {JSONValue} from './JSONValue';

export class JSONReader {

    private input: string;
    private index: number;
    private readonly length: number;

    constructor(input: string) {
        this.input = input;
        this.index = 0;
        this.length = input.length;
    }

    public read(): JSONValue {
        this.skipWhitespaces();
        const value = this.readValue();

        if (this.index < this.length) {
            throw new Error("Unexpected content.");
        }

        return value;
    }

    private readValue(): JSONValue {
        const type = this.getType();
        if (type === "object") {
            return this.readValueObject();
        }
        if (type === "array") {
            return this.readValueArray();
        }
        if (type === "string") {
            return this.readValueString();
        }
        if (type === "any") {
            return this.readValueAny();
        }
        throw new Error("Expected value.");
    }

    private readValueArray(): JSONArray {
        const list = new JSONArray();

        this.readChar('[');

        let type = this.getType();
        while (type !== "arrayEnd") {
            const item = this.readValue();
            list.push(item);
            type = this.getType();
            if (type !== "comma") {
                break;
            }
            this.readChar(',');
        }

        this.readChar(']');

        return list;
    }

    private readValueObject(): JSONObject {
        const list = new JSONObject();

        this.readChar('{');

        let type = this.getType();
        while (type !== "objectEnd") {
            const key = this.readValueString();
            this.readChar(':');
            const val = this.readValue();
            const item = new JSONTuple(key, val);
            list.push(item);
            type = this.getType();
            if (type !== "comma") {
                break;
            }
            this.readChar(',');
        }

        this.readChar('}');

        return list;
    }

    private readValueAny(): string {
        let string = '';
        let c: string;

        while (this.index < this.length) {
            c = this.input.charAt(this.index);

            if (c == ' ' || c == '\t' || c == '\r' || c == '\n' || c == ',' || c == '}' || c == ']') {
                break;
            }

            this.index++;
            string += c;
        }

        this.skipWhitespaces();
        return string;
    }

    private getType(): string {
        let c: string;
        try {
            c = this.input.charAt(this.index);
        } catch (e) {
            return "error";
        }
        if (c == '"') {
            return "string";
        }
        if (c == '{') {
            return "object";
        }
        if (c == '}') {
            return "objectEnd";
        }
        if (c == '[') {
            return "array";
        }
        if (c == ']') {
            return "arrayEnd";
        }
        if (c == ',') {
            return "comma";
        }
        return "any";
    }

    private readChar(expected: string): void {
        this.readCharExact(expected);
        this.skipWhitespaces();
    }

    private readCharExact(expected: string): void {
        const c = this.input.charAt(this.index++);
        if (c !== expected) {
            throw new Error("Expected `" + expected + "`.");
        }
    }

    private readValueString(): string {
        let string = '';

        this.readCharExact('"');
        string += '"';

        let escaped = false;
        while (this.index < this.length) {
            let c = this.input.charAt(this.index);

            if (c == '\n') {
                throw new Error("Unexpected `\\n`.");
            }

            if (c == '\r') {
                throw new Error("Unexpected `\\r`.");
            }

            if (c == '"' && !escaped) {
                break;
            }

            this.index++;
            string += c;
            escaped = c == '\\' && !escaped;
        }

        this.readChar('"');
        string += '"';
        return string;
    }

    private skipWhitespaces(): void {
        while (this.index < this.length) {
            let c = this.input.charAt(this.index);
            if (c == ' ' || c == '\t' || c == '\r' || c == '\n') {
                this.index++;
                continue;
            }
            break;

        }
    }

}
