export interface Config {
    appId: string,
    token: string,
    mode: string
    sandbox: boolean,
    backendPrefix: string,
    postChannel: string,
    maxTimeToTry: number,
    excludedUsers: Array<string>,
    excludedChannels: Array<string>,
    kisinId: string,
    greetingColdDown: number,
}

export const config: Config = {
    appId: "101996873",
    token: "EzS8aRVNyGIXMJMEQNpl4pHWi4igN7rv",
    mode: process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development",
    sandbox: process.env.NODE_ENV === "development",
    backendPrefix: "https://ning.kisin.tech/api",
    postChannel: "3370836",
    maxTimeToTry: 10,
    excludedUsers: [

    ],
    excludedChannels: [
        "4432291", // 页友专区
    ],
    kisinId: "11290273580795802656",
    greetingColdDown: 600,
};
