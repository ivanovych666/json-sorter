import {alphabeticalSort} from './alphabeticalSort';

export const alphabeticalReverseSort = (a: string, b: string) => {
    return -alphabeticalSort(a, b)
};
