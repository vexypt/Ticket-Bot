import { JsonDatabase } from "wio.db";
import { GuildData } from "./interfaces/guildData.js";

const db = new JsonDatabase<GuildData>({
    databasePath: "ticketConfig.json"
});

export { db };