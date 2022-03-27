import {alphabeticalCiSort} from './alphabeticalCiSort';

export const alphabeticalReverseCiSort = (a: string, b: string) => {
    return -alphabeticalCiSort(a, b)
};
