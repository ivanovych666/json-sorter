import {JSONReader} from './JSONReader';
import {JSONWriter} from './JSONWriter';
import {Comparator, Compare} from './Comparator';

export const jsonSort = (input: string, compare: Compare<string>): string => {
    const comparator = new Comparator(compare);
    const writer = new JSONWriter(comparator);
    const reader = new JSONReader(input);
    const value = reader.read();
    return writer.write(value);
};
