import {naturalSort} from './naturalSort';

export const naturalReverseSort = (a: string, b: string) => {
    return -naturalSort(a, b)
};
