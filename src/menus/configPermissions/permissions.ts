import { guildDb } from "#database";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { type InteractionReplyOptions, Client, RoleSelectMenuBuilder } from "discord.js"

export async function configPermissionsMenu<R>(client: Client, guildId: string): Promise<R> {

    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if(!guildConfig) {
        guildConfig = { staffRole: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }
    const guild = client.guilds.cache.get(guildId);
    const staffRoleId = guildConfig?.staffRole;
    const staffRole = staffRoleId ? guild?.roles.cache.get(staffRoleId) : null;
    

    const embedConfig = createEmbed({
        color: settings.colors.azoxo,
        title: "Configure as permissões dos ticket",
        description: `-# **Cargo de staff:** ${staffRole ?? "`Não configurado`"}`,
    });

    const row = createRow(
        new RoleSelectMenuBuilder({
            customId: "configTicket/configStaffRole",
            placeholder: "Selecione um cargo de staff",
            minValues: 1,
            maxValues: 1,
        })
    );

    return ({
        flags: ["Ephemeral"],
        embeds: [embedConfig],
        components: [row],
    } satisfies InteractionReplyOptions) as R;
}