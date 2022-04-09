import {JSONReader} from './JSONReader';
import {JSONWriter} from './JSONWriter';
import {Comparator, Compare} from './Comparator';
import {Comparators} from './comparators';

interface JsonSortOptions {
    caseInsensitive: boolean;
    reverse: boolean;
    natural: boolean;
}

export const jsonSort = (input: string, options?: JsonSortOptions | Compare<string>): string => {
    let compare: Compare<string> | null = null;

    if (typeof options === 'function') {
        compare = options;
    } else if (options) {
        const {caseInsensitive, reverse, natural} = options;
        const comparatorName = [
            natural ? 'natural' : 'alphabetical',
            reverse ? 'Reverse' : '',
            caseInsensitive ? 'Ci' : '',
            'Sort',
        ].join('');
        compare = (Comparators as any)[comparatorName];
    }

    if (!compare) {
        compare = Comparators.alphabeticalSort;
    }

    const comparator = new Comparator(compare);
    const writer = new JSONWriter(comparator);
    const reader = new JSONReader(input);
    const value = reader.read();
    return writer.write(value);
};
