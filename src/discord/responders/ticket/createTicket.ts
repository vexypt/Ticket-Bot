import { createResponder, ResponderType } from "#base";
import { guildDb, ticketDb } from "#database";
import { menus } from "#menus";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from "discord.js";

createResponder({
    customId: "createTicket/:type",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { type }: { type: "support" | "budget" }) {
        const { guildId, user, guild } = interaction;

        // Verificar configurações da guild
        const guildConfig = guildDb.get(`guilds.${guildId}`);
        if (!guildConfig) {
            interaction.reply({
                content: "Configuração do servidor não encontrada. Peça ao administrador para configurar as categorias.",
                flags: ["Ephemeral"]
            });
            return;
        }

        // Determinar a categoria com base no tipo de ticket
        const categoryId =
            type === "support"
                ? guildConfig.supportCategoryId
                : type === "budget"
                ? guildConfig.budgetCategoryId
                : null;
        
        if (!categoryId) {
            await interaction.reply({
                content: `A categoria para tickets de **${type === "support" ? "suporte" : "orçamento"}** não está configurada. Peça ao administrador para corrigir.`,
                flags: ["Ephemeral"],
            });
            return;
        }

        // Definir o nome do canal com base no tipo
        const channelName =
            type === "support"
                ? `🎫┃${user.username}` // Suporte
                : `💎┃${user.username}`; // Orçamento

        // Criar o canal do ticket
        const ticketChannel = await guild.channels.create({
            name: channelName,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone.id,
                    deny: [PermissionFlagsBits.ViewChannel]
                },
                {
                    id: user.id,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.SendMessages,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.EmbedLinks,
                    ]
                },
                {
                    id: guildConfig.staffRole!,
                    allow: [
                        PermissionFlagsBits.ViewChannel,
                        PermissionFlagsBits.ReadMessageHistory,
                        PermissionFlagsBits.AttachFiles,
                        PermissionFlagsBits.EmbedLinks,
                        PermissionFlagsBits.SendMessages,
                    ]
                },
            ]
        });

        // Salvar o ticket no banco de dados
        ticketDb.set(`tickets.${ticketChannel.id}`, {
            type,
            createdBy: user.id,
            users: [user.id],
            priorityLevel: 0,
            closed: false,
            assumedBy: null,
        });

        // Enviar mensagem no canal do ticket
        await ticketChannel.send(menus.ticket.secondaryMenu(interaction));

        const row = createRow(
            new ButtonBuilder({
                style: ButtonStyle.Link,
                label: "Ir para o ticket",
                url: ticketChannel.url,
                emoji: type === "support" ? "🎫" : "💎",
            })
        );

        interaction.reply({
            content: `Ticket de **${type === "support" ? "suporte" : "orçamento"}** criado com sucesso!`,
            components: [row],
            flags: ["Ephemeral"],
        });
    },
});