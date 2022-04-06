import {IMessage} from "qq-guild-bot";
import axios from "axios";
import {config} from "./config";

export function getRandomPhoto() {
    return axios
        .post("/get-random-photo")
        .then((response: { data: { filename: string, description: string, frequency: number } }) => {
            const data = response.data;
            const path = config.backendPrefix + "/ning/" + data.filename;
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

export function deciding<T>(developmentChoice: T, productionChoice: T): (mode: string) => T {
    return (mode: string) => {
        return mode === "development" ? developmentChoice : productionChoice;
    };
}
