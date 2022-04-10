import * as fs from "fs/promises";

export interface Repost {
    name: string;
    content: string;
}

export interface Comment {
    name: string;
    content: string;
    time: string;
}

export interface Weibo {
    avatar: string;
    content: string;
    photos: Array<string>;
    repost?: Repost;
    time: string;
    comments: Array<Comment>;
}

function repostToString(repost: Repost | undefined): string {
    if(repost === undefined) {
        return "";
    }
    return `转发自：\n${repost.name}：\n${repost.content}\n`;
}

function commentToString(comment: Comment): string {
    return `${comment.name}：${comment.content}（${comment.time}）`;
}

function commentsToString(comments: Array<Comment>): string {
    let result = "";
    for (const comment of comments) {
        result += commentToString(comment) + "\n";
    }
    return result;
}

export function weiboToString(weibo: Weibo): string {
    return `SNH48-林忆宁\n${weibo.content}\n${repostToString(weibo.repost)}${weibo.time}\n评论区：\n${commentsToString(weibo.comments)}`;
}

let weiboList: Array<Weibo> = [];

export async function getWeiboData(): Promise<Array<Weibo>> {
    if (weiboList.length === 0) {
        const buffer = await fs.readFile("static/weibo.json");
        weiboList = JSON.parse(buffer.toString());
        console.log("all weibo loaded");
    }
    return weiboList;
}
