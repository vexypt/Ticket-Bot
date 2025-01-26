import { StringSelectMenuBuilder, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";
import { guildDb } from "#database";

export function choosePriorityMenu<R>(guildId: string): R {

    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if (!guildConfig) {
        guildConfig = { supportCategoryId: null, budgetCategoryId: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }

    const embed = createEmbed({
        color: settings.colors.azoxo,
        description: brBuilder(
            "# Escolha a prioridade do ticket:",
            "-# Evite trocar a prioridade muito rápido, devido a limitações do Discord, ao trocar rapidamente e repitidamente o nome do canal poderá ocorrer erros"
        )
    });

    const row = createRow(
        new StringSelectMenuBuilder({
            customId: "ticketSec/select/defPriority",
            placeholder: "Selecione o nivel de prioridade do ticket",
            minValues: 1,
            maxValues: 1,
            options: [
                {
                    label: "Alta",
                    description: "Defina a prioridade como alta",
                    value: "3",
                    emoji: "🔴",
                },
                {
                    label: "Média",
                    description: "Defina a prioridade como média",
                    value: "2",
                    emoji: "🟠",
                },
                {
                    label: "Baixa",
                    description: "Defina a prioridade como baixa",
                    value: "1",
                    emoji: "🔵",
                },
            ]
        })
    );

    return ({
        embeds: [embed], components: [row], flags: ["Ephemeral"]
    } satisfies InteractionReplyOptions) as R;
}