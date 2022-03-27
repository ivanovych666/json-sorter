import {naturalCiSort} from './naturalCiSort';

export const naturalReverseCiSort = (a: string, b: string) => {
    return -naturalCiSort(a, b)
};
