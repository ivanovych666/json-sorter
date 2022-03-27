export type Compare<T> = (a: T, b: T) => number;

export class Comparator<T> {

    constructor(public compare: Compare<T>) {
    }

}
