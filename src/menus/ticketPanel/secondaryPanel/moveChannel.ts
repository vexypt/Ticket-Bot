import { StringSelectMenuBuilder, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";
import { guildDb } from "#database";

export function moveChannelMenu<R>(guildId: string): R {

    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if (!guildConfig) {
        guildConfig = { supportCategoryId: null, budgetCategoryId: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }

    const embed = createEmbed({
        color: settings.colors.azoxo,
        description: brBuilder(
            "# Escolha a categoria para mover o canal:"
        )
    });

    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "ticketSec/select/moveChannel",
            placeholder: "Selecione a categoria para mover o ticket",
            minValues: 1,
            maxValues: 1,
            options: [
                {
                    label: "Categoria de suporte",
                    value: `${guildConfig.supportCategoryId}`,
                    //emoji: "",
                },
                {
                    label: "Categoria de orçamento",
                    value: `${guildConfig.budgetCategoryId}`,
                    //emoji: "",
                }
            ]
        })
    );

    return ({
        embeds: [embed], components: [row], flags: ["Ephemeral"]
    } satisfies InteractionReplyOptions) as R;
}