import * as fs from "fs/promises";

export interface Config {
    appId: string,
    token: string,
    mode: string
    sandbox: boolean,
    backendPrefix: string,
    resourcePrefix: string
    postChannel: string,
    maxTimeToTry: number,
    excludedUsers: Set<string>,
    excludedChannels: Array<string>,
    kisinId: string,
}

export async function readExcludedChannels(): Promise<Array<string>> {
    const buffer = await fs.readFile("static/excluded-channel.json");
    return JSON.parse(buffer.toString());
}

export const config: Config = {
    appId: "101996873",
    token: "EzS8aRVNyGIXMJMEQNpl4pHWi4igN7rv",
    mode: process.env.NODE_ENV !== undefined ? process.env.NODE_ENV : "development",
    sandbox: process.env.NODE_ENV === "development",
    backendPrefix: "https://ning.kisin.tech/api",
    resourcePrefix: "https://ning-1304012538.file.myqcloud.com",
    postChannel: "3370836",
    maxTimeToTry: 10,
    excludedUsers: new Set<string>(),
    excludedChannels: [],
    kisinId: "11290273580795802656",
};
