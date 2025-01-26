import { createCommand } from "#base";
import { guildDb } from "#database";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, PermissionFlagsBits, TextChannel } from "discord.js";

createCommand({
    name: "ticket",
    nameLocalizations: {
        "pt-BR": "ticket"
    },
    description: "Config module",
    options: [
        {
            name: "config",
            nameLocalizations: {
                "pt-BR": "configurar"
            },
            description: "Config the ticket",
            descriptionLocalizations: {
                "pt-BR": "Configura o ticket"
            },
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "send-panel",
            nameLocalizations: {
                "pt-BR": "enviar-painel"
            },
            description: "Send the ticket panel",
            descriptionLocalizations: {
                "pt-BR": "Envia o painel de tickets"
            },
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "channel",
                    nameLocalizations: {
                        "pt-BR": "canal"
                    },
                    description: "The channel to send the panel",
                    descriptionLocalizations: {
                        "pt-BR": "O canal para enviar o painel"
                    },
                    type: ApplicationCommandOptionType.Channel,
                    channelTypes: [ChannelType.GuildText],
                    required: true
                }
            ]
        }
    ],
    defaultMemberPermissions: [PermissionFlagsBits.Administrator],
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { options, guildId, client } = interaction;
        
        switch (options.getSubcommand(true)) {
            case "config": {
                interaction.reply(menus.config.main(guildId, client));
                return;
            }
            case "panel": {
                const channel = options.getChannel("channel", true) as TextChannel;

                // Verifica as configurações necessárias
                const guildConfig = guildDb.get(`guilds.${guildId}`);
                if
                (
                    !guildConfig ||
                    !guildConfig.supportCategoryId ||
                    !guildConfig.budgetCategoryId ||
                    !guildConfig.staffRole
                ) {
                    await interaction.reply({
                        content: "Sistema de ticket ainda não configurado, por favor verifique se está tudo configurado corretamente.",
                        flags: ["Ephemeral"]
                    });
                    return;
                }

                channel.send(menus.ticket.MainPanel(interaction)).then(() => {
                    interaction.reply({
                        content: "Painel enviado com sucesso!",
                        flags: ["Ephemeral"]
                    });
                })
                return;
            }
        }
    }
});