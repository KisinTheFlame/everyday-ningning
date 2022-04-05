import {IMessage} from "qq-guild-bot";
import axios from "axios";
import {environment} from "../config";

export function getRandomPhoto() {
    return axios
        .post("/get-random-photo")
        .then((response: { data: { filename: string, description: string, frequency: number } }) => {
            const data = response.data;
            const path = environment.backendPrefix + "/ning/" + data.filename;
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
