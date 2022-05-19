import {client, ws} from "./environment";
import {config} from "./config";

const content =
`
古戸絵梨花
日本語ができるきしんのことが大好きなんだ！
2022年4月25日22时26分
`.trim();

client.messageApi.postMessage(
    config.postChannel,
    {
        content: content
    }
);
