export abstract class Fetch {
    abstract text(path: string, dirname?: string): Promise<string | void>;
    // eslint-disable-next-line no-unused-vars
    abstract actionText<T = any>(request?: any): Promise<T | void>;
    abstract actionJson<T = any>(request?: any): Promise<T | void>;
}
