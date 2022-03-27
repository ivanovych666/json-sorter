import {alphabeticalSort} from './alphabeticalSort';

export const alphabeticalCiSort = (s1: string, s2: string) => {
    const n1 = s1.length;
    const n2 = s2.length;

    const min = Math.min(n1, n2);

    for (let i = 0; i < min; i++) {
        let c1 = s1.charAt(i);
        let c2 = s2.charAt(i);

        if (c1 !== c2) {

            c1 = c1.toUpperCase();
            c2 = c2.toUpperCase();

            if (c1 !== c2) {

                c1 = c1.toLowerCase();
                c2 = c2.toLowerCase();

                if (c1 != c2) {
                    return alphabeticalSort(c1, c2)
                }

            }

        }

    }

    return n1 - n2;
}
