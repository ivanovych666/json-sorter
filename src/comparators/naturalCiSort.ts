import {normalize} from './naturalSort';
import {alphabeticalCiSort} from './alphabeticalCiSort';

export const naturalCiSort = (a: string, b: string) => {
    return alphabeticalCiSort(normalize(a), normalize(b));
};
