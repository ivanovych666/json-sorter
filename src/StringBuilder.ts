export class StringBuilder {
    private value = '';

    public append(value: string): StringBuilder {
        this.value += value;
        return this;
    }

    public toString(): string {
        return this.value;
    }
}
