import {alphabeticalSort} from './alphabeticalSort';

const padStartZero = (value: string, length: number) => {
    const needs = length - value.length;
    let pad = '';
    if (needs > 0) {
        pad = '0'.repeat(needs);
    }
    return pad + value;
};

export const normalize = (str: string): string => {
    return str.replace(/\d+/g, match => {
        return padStartZero(match, 20)
    });
};

export const naturalSort = (a: string, b: string) => {
    return alphabeticalSort(normalize(a), normalize(b));
};
