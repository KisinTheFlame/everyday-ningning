export const config: Config = {
    appID: "101996873",
    token: "EzS8aRVNyGIXMJMEQNpl4pHWi4igN7rv",
    mode: process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development",
    sandbox: process.env.NODE_ENV === "development",
    backendPrefix: "https://ning.kisin.tech/api",
    postChannel: "3370836",
    maxTimeToTry: 10,
    excludedChannels: [
        "4432291", // 页友专区
    ],
};

export interface Config {
    appID: string,
    token: string,
    mode: string
    sandbox: boolean,
    backendPrefix: string,
    postChannel: string,
    maxTimeToTry: number,
    excludedChannels: Array<string>,
}
