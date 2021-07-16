export abstract class Fetch {
    abstract file(path: string): Promise<string | undefined>;
    // eslint-disable-next-line no-unused-vars
    abstract action<T = any>(request?: any): Promise<undefined>;
}
