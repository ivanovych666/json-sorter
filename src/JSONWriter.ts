import { JSONTuple } from "./JSONTuple";
import {JSONValue} from './JSONValue';
import {JSONObject} from './JSONObject';
import {StringBuilder} from './StringBuilder';
import {Comparator} from './Comparator';

export interface JsonSortWriterOptions<T = number> {
    indent: T | string;
    newline: string;
    finalNewline: boolean;
}

export class JSONWriter {

    private comparator: Comparator<JSONTuple>;
    private options: JsonSortWriterOptions<string>;
    private depth = 0;

    constructor(comparator: Comparator<string>, options: Partial<JsonSortWriterOptions>) {
        this.comparator = new Comparator((a: JSONTuple, b: JSONTuple) => {
            const as = a.getKey();
            const bs = b.getKey();
            return comparator.compare(
                as.substring(1, as.length - 1),
                bs.substring(1, bs.length - 1)
            );
        });
        let indent = '';
        if (options.indent) {
            if (typeof options.indent === 'number') {
                indent = ' '.repeat(options.indent);
            } else {
                indent = options.indent;
            }
        }
        this.options = {
            indent,
            newline: options.newline || '',
            finalNewline: options.finalNewline || false,
        };
        if (this.options.indent && !this.options.newline) {
            this.options.newline = '\n';
        }
    }

    public write(value: JSONValue): string {
        let stringBuilder = new StringBuilder();
        this.writeIntoStringBuilder(stringBuilder, value);
        if (this.options.finalNewline) {
            stringBuilder.append(this.options.newline);
        }
        return stringBuilder.toString();
    }

    private writeIntoStringBuilder(stringBuilder: StringBuilder, value: JSONValue): void {

        if (typeof value === 'string') {
            stringBuilder.append(value);
        } else if (value instanceof JSONObject) {
            stringBuilder.append('{');
            this.depth++;

            const list = value;

            list.sort(this.comparator.compare);

            for (let i = 0, size = list.length; i < size; i++) {
                if (i > 0) {
                    stringBuilder.append(',');
                }

                const keyValue = list[i];

                const key = keyValue.getKey();
                const val = keyValue.getValue();

                if (this.options.indent) {
                    this.appendIndentation(stringBuilder);
                }
                stringBuilder.append(key).append(':');
                if (this.options.indent) {
                    stringBuilder.append(' ');
                }

                this.writeIntoStringBuilder(stringBuilder, val);
            }

            this.depth--;
            if (this.options.indent) {
                this.appendIndentation(stringBuilder);
            }
            stringBuilder.append('}');
        } else {
            stringBuilder.append('[');
            this.depth++;

            const list = value;

            for (let i = 0, size = list.length; i < size; i++) {
                if (i > 0) {
                    stringBuilder.append(',');
                }
                const item = list[i];
                if (this.options.indent) {
                    this.appendIndentation(stringBuilder);
                }
                this.writeIntoStringBuilder(stringBuilder, item);
            }

            this.depth--;
            if (this.options.indent) {
                this.appendIndentation(stringBuilder);
            }
            stringBuilder.append(']');
        }

    }

    private appendIndentation(stringBuilder: StringBuilder): void {
        stringBuilder.append(this.options.newline).append(this.options.indent.repeat(this.depth));
    }

}
