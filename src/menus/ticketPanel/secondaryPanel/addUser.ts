import { UserSelectMenuBuilder, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";

export function addUserMenu<R>(allUsers: Array<string>): R {

    const userList = allUsers.map(userId => `<@${userId}>`).join("\n");

    const embed = createEmbed({
        description: brBuilder(
            "# Adicione um usuário ao ticket\n",
            "**Usuários atuais no ticket:**",
            `${userList}`
        ),
        color: settings.colors.azoxo,
    });

    const row = createRow(
        new UserSelectMenuBuilder({
            customId: "ticketSec/select/addUser",
            placeholder: "Selecione um usuário para adicionar ao ticket",
            minValues: 1,
            maxValues: 1,
        })
    );

    return ({
        flags: ["Ephemeral"], embeds: [embed], components: [row]
    } satisfies InteractionReplyOptions) as R;
}