import { JsonDatabase } from "wio.db";
import { GuildData, TicketData } from "./interfaces/guildAndTicketData.js";

const guildDb = new JsonDatabase<GuildData>({
    databasePath: "guildConfig.json",
});

const ticketDb = new JsonDatabase<TicketData>({
    databasePath: "ticketData.json",
});

export { guildDb, ticketDb };
