import {reply, ReplyPattern, replyPlainGreeting} from "./base-reply";
import {announceFrequency, atUser, deciding, getRandomPhoto} from "../util";
import {config} from "../config";

export const simpleReplyPatterns: Array<ReplyPattern> = [
    {
        commandKeyword: deciding("morning", ["早上好", "早安"]),
        response: replyPlainGreeting([
            "早安早安~",
            "早上好捏~",
        ]),
    },
    {
        commandKeyword: deciding("noon", ["中午好", "午安"]),
        response: replyPlainGreeting([
            "中午好哦~",
            "午安！",
        ]),
    },
    {
        commandKeyword: deciding("evening", "晚上好"),
        response: replyPlainGreeting([
            "晚儿好晚儿好~",
            "好好好，吃过饭了不？",
        ]),
    },
    {
        commandKeyword: deciding("night", ["晚安", "おやすみ", "お休み", "night"]),
        response: replyPlainGreeting([
            "晚安噜~",
            "おやすみなさい～",
            "night night！",
        ]),
    },
    {
        commandKeyword: deciding(["mua", "亲亲"], ["mua", "亲亲", "亲我"]),
        response: replyPlainGreeting(["mua~", "不可以随便mua的说！那……那那那那，mua……"]),
    },
    {
        commandKeyword: deciding("mother", "妈"),
        response: replyPlainGreeting([
            "宝贝儿，妈妈在这里~",
            "乖，不哭不哭~你已经很棒了！",
            "注意休息呀宝贝儿，别累着了~",
            "要多少钱啊宝贝儿？",
            "怎么又闯祸啦！没事，我是你妈妈，有什么不敢说的？",
            "给你买了件新衣服宝贝儿，快试试合不合身~",
            "不痛不痛，让妈妈抱抱~",
            "蛋包饭做好了宝贝儿，快去洗手手吧~",
            "这么大了，还让妈妈哄着睡呢？这孩子~",
            "哎呀~妈妈给你买了新游戏，快来看看~",
            "尽力就行啦，你考多少分都是妈妈的骄傲！",
            "这么累干嘛呀？身体最重要，哎呀，没事！妈妈有钱，大不了妈妈养你一辈子！",
            "想吃这个吗？要不要多买几个？",
            "多大了还要妈妈帮你洗澡？哎呦…",
            "不行！太危险了，你给我回来！",
            "妈妈只有你了，你出了什么事妈妈也活不下去了！",
            "多大了还跟妈妈撒娇呢~",
            "我是你妈，我不疼你谁疼你啊~",
            "妈妈没别的要求，只要你健健康康的就行啦！",
            "脸嫩脏啊，快过来，妈妈给你洗洗！",
            "手好凉，怎么回事？别动，妈给你暖暖！",
        ]),
    },
    {
        commandKeyword: () => "今天几号",
        response: replyPlainGreeting([
            "十六号喽"
        ]),
    },
    {
        commandKeyword: () => ["吃薯片吗"],
        response: replyPlainGreeting(
            [
                "吃！",
                "你这么好欺负的吗？"
            ],
            `${config.backendPrefix}/special/chip.jpg`
        ),
    },
    {
        commandKeyword: () => ["看", "别的女人"],
        response: replyPlainGreeting([
            "哎，无所谓！真无所谓！",
            "看别的女人就别跟我说了，哼",
            "我知道你在我不在的时候去看了别的女人，没事的，我不会生气的（上膛）",
        ]),
    },
    {
        commandKeyword: () => "急了",
        response: replyPlainGreeting([
            "哪里急了！"
        ]),
    },
    {
        commandKeyword: () => "典中典",
        response: replyPlainGreeting([
            "哪里典中典了！"
        ])
    },
    {
        commandKeyword: () => "典",
        response: replyPlainGreeting([
            "哪里典了！"
        ]),
    },
];
