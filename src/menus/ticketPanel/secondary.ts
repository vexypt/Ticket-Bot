import { ButtonBuilder, ButtonStyle, Interaction, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";

export function secondaryMenu<R>(interaction: Interaction, assumedBy: string | null): R {
    
    const embedPanel = createEmbed({
        color: settings.colors.azoxo,
        description: brBuilder(
            `# Atendimento ${interaction.guild!.name}`,
            "- Caso deseje cancelar ou sair, basta __clicar no botão vermelho__.",
            "- Lembrando que os __botões cinzas__ são exclusivos para a equipe de suporte!"
        )
    });

    if (assumedBy) {
        const userMention = interaction.guild!.members.cache.get(assumedBy) || assumedBy;
        embedPanel.addFields(
            [
                {
                    name: "Ticket assumido",
                    value: `Assumido por: ${userMention}`,
                    inline: true
                }
            ]
        );
    }

    const row1 = createRow(
        new ButtonBuilder({
            customId: "ticketSec/button/addUser",
            label: "Adicionar Usuário",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/removeUser",
            label: "Remover Usuário",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/NotfUser",
            label: "Notíficar Usuário",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/AssumTicket",
            label: "Assumir Ticket",
            style: ButtonStyle.Secondary,
            disabled: assumedBy ? true : false
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/createCall",
            label: "Criar chamada",
            style: ButtonStyle.Secondary,
        }),
    );

    const row2 = createRow(
        new ButtonBuilder({
            customId: "ticketSec/button/moveChannel",
            label: "Mover Canal",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/defPriority",
            label: "Definir Prioridade",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/leaveTicket",
            label: "Sair ou Cancelar",
            style: ButtonStyle.Danger,
        }),
        new ButtonBuilder({
            customId: "ticketSec/button/finalizeTicket",
            label: "Finalizar",
            style: ButtonStyle.Primary,
        })
    );

    return ({
        embeds: [embedPanel],
        components: [row1, row2],
        flags: []
    } satisfies InteractionReplyOptions) as R;
}
