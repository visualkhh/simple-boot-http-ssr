export interface Initializer<T = any> {
    run(...args: any[]): Promise<T>;
}