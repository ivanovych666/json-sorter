import {JSONReader} from './JSONReader';
import {JsonSortWriterOptions, JSONWriter} from './JSONWriter';
import {Comparator, Compare} from './Comparator';
import {Comparators} from './comparators';

interface JsonSortComparatorOptions {
    compare?: Compare<string>;
    caseInsensitive?: boolean;
    reverse?: boolean;
    natural?: boolean;
}

interface JsonSortOptions extends JsonSortComparatorOptions, Partial<JsonSortWriterOptions> {}

export const jsonSort = (input: string, options: JsonSortOptions = {}): string => {
    let compareFunc: Compare<string> | null;

    let {caseInsensitive, reverse, natural, compare, indent, newline, finalNewline} = options;
    if (typeof compare === 'function') {
        compareFunc = compare;
    } else {
        const comparatorName = [
            natural ? 'natural' : 'alphabetical',
            reverse ? 'Reverse' : '',
            caseInsensitive ? 'Ci' : '',
            'Sort',
        ].join('');
        compareFunc = (Comparators as any)[comparatorName];
    }

    if (!compareFunc) {
        compareFunc = Comparators.alphabeticalSort;
    }

    if (indent == null) {
        const matches = input.match(/[\n\r]+(\s+)/);
        indent = matches && matches[1].length || 0;
    }

    if (newline == null) {
        const matches = input.match(/\n\r|\r\n|\n|\r/);
        newline = matches && matches[0] || '';
    }

    if (finalNewline == null) {
        const matches = input[input.length - 1].match(/[\n\r]/);
        finalNewline = Boolean(matches);
    }

    const reader = new JSONReader(input);
    const value = reader.read();
    const comparator = new Comparator(compareFunc);
    const writer = new JSONWriter(comparator, {indent, newline, finalNewline});
    return writer.write(value);
};
