import {IMessage} from "qq-guild-bot";
import axios from "axios";
import {config} from "./config";
import * as fs from "fs/promises";

export function getRandomPhoto() {
    return axios
        .post("/get-random-photo")
        .then((response: { data: { filename: string, description: string, frequency: number } }) => {
            const data = response.data;
            const path = config.resourcePrefix + "/ning/" + data.filename;
            const description = data.description;
            const frequency = data.frequency;
            return {
                path: path,
                description: description,
                frequency: frequency
            };
        });
}

export function atUser(userMessage: IMessage) {
    return `<@!${userMessage.author.id}>`;
}

export function announceFrequency(frequency: number): string {
    return `这是本图片第${frequency}次出现哦！`;
}

export function deciding<T>(developmentChoice: T | Array<T>, productionChoice: T | Array<T>): (mode: string) => T | Array<T> {
    return (mode: string) => {
        return mode === "development" ? developmentChoice : productionChoice;
    };
}

export function randomOf<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
}

export async function excludeChannel(channelId: string) {
    config.excludedChannels.push(channelId);
    await fs.writeFile("static/excluded-channel.json", JSON.stringify(config.excludedChannels));
}