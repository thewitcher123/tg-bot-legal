import path from "path";

import {BotContext} from "@/app/api/bot/types";

export const NikitaVideoCircle = path.join(process.cwd(), 'public', 'Nikita_circle_video.mp4');

export const answerWithNikitaVideoCircle = async (ctx: BotContext) => {
    try {
        return await ctx.replyWithVideoNote(
            {source: NikitaVideoCircle},
            {
                duration: 10,
                length: 240
            }
        );
    } catch (error) {
        console.error('Error sending photo:', error);
    }
};
