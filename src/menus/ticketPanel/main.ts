import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, Interaction, type InteractionReplyOptions } from "discord.js"

export function Panel<R>(interaction: Interaction): R {
    
    const embedConfig = createEmbed({
        color: settings.colors.azoxo,
        author: {
            name: interaction.guild!.name,
            iconURL: interaction.guild!.iconURL() || undefined
        },
        description: brBuilder(
            "Selecione uma opção de acordo com o assunto que deseja tratar com nossa equipe.",
            "",
            "**Lembre-se:** cada tipo de ticket é destinado exclusivamente ao tema escolhido, garantindo um atendimento mais eficiente."
        ),
        // image: { url: "" }
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "createTicket/support",
            label: "Suporte",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "createTicket/budget",
            label: "Orçamento",
            style: ButtonStyle.Primary,
        }),
    );

    return ({
        flags: ["Ephemeral"],
        embeds: [embedConfig],
        components: [row],
    } satisfies InteractionReplyOptions) as R;
}