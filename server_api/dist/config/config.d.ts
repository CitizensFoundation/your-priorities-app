export namespace production {
    let use_env_variable: string;
    let dialect: string;
    let ssl: boolean;
    namespace dialectOptions {
        export namespace ssl_1 {
            let require: boolean;
            let rejectUnauthorized: boolean;
        }
        export { ssl_1 as ssl };
    }
}
