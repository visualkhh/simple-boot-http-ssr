export interface Initializer<T> {
    run(...args: any[]): Promise<T>;
}