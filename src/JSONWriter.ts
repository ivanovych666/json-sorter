import { JSONTuple } from "./JSONTuple";
import {JSONValue} from './JSONValue';
import {JSONObject} from './JSONObject';
import {StringBuilder} from './StringBuilder';
import {Comparator} from './Comparator';

export class JSONWriter {

    private comparator: Comparator<JSONTuple>;

    constructor(comparator: Comparator<string>) {
        this.comparator = new Comparator((a: JSONTuple, b: JSONTuple) => {
            const as = a.getKey();
            const bs = b.getKey();
            return comparator.compare(
                as.substring(1, as.length - 1),
                bs.substring(1, bs.length - 1)
            );
        });
    }

    public write(value: JSONValue): string {
        let stringBuilder = new StringBuilder();
        this.writeIntoStringBuilder(stringBuilder, value);
        return stringBuilder.toString();
    }

    private writeIntoStringBuilder(stringBuilder: StringBuilder, value: JSONValue): void {

        if (typeof value === 'string') {
            stringBuilder.append(value);
        } else if (value instanceof JSONObject) {
            stringBuilder.append('{');

            const list = value;

            list.sort(this.comparator.compare);

            for (let i = 0, size = list.length; i < size; i++) {
                if (i > 0) {
                    stringBuilder.append(',');
                }

                const keyValue = list[i];

                const key = keyValue.getKey();
                const val = keyValue.getValue();

                stringBuilder.append(key).append(':');

                this.writeIntoStringBuilder(stringBuilder, val);
            }

            stringBuilder.append('}');
        } else {
            stringBuilder.append('[');

            const list = value;

            for (let i = 0, size = list.length; i < size; i++) {
                if (i > 0) {
                    stringBuilder.append(',');
                }
                const item = list[i];
                this.writeIntoStringBuilder(stringBuilder, item);
            }

            stringBuilder.append(']');
        }

    }

}
