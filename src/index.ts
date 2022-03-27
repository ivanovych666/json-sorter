import {JSONReader} from './JSONReader';
import {JSONWriter} from './JSONWriter';
import {Comparator, Compare} from './Comparator';
import {Comparators} from './comparators';

export const jsonSort = (input: string, compare: Compare<string> = Comparators.alphabeticalSort): string => {
    const comparator = new Comparator(compare);
    const writer = new JSONWriter(comparator);
    const reader = new JSONReader(input);
    const value = reader.read();
    return writer.write(value);
};
