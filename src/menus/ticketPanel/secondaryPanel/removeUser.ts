import { UserSelectMenuBuilder, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";

export function removeUserMenu<R>(allUsers: Array<string>): R {

    const userList = allUsers.map(userId => `<@${userId}>`).join("\n");

    const embed = createEmbed({
        description: brBuilder(
            "# Remova um usuário do ticket\n",
            "**Usuários atuais no ticket:**",
            `${userList}`
        ),
        color: settings.colors.azoxo,
    });

    const row = createRow(
        new UserSelectMenuBuilder({
            customId: "ticketSec/select/removeUser",
            placeholder: "Selecione um usuário para remover do ticket",
            minValues: 1,
            maxValues: 1,
        })
    );

    return ({
        flags: ["Ephemeral"], embeds: [embed], components: [row]
    } satisfies InteractionReplyOptions) as R;
}