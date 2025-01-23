import { createCommand } from "#base";
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
            name: "permissions",
            nameLocalizations: {
                "pt-BR": "permissoes"
            },
            description: "Config the ticket permissions",
            descriptionLocalizations: {
                "pt-BR": "Configura as permissões do ticket"
            },
            type: ApplicationCommandOptionType.Subcommand,
        },
        {
            name: "panel",
            nameLocalizations: {
                "pt-BR": "painel"
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
            case "permissions": {
                interaction.reply(await menus.configPermissions(client, guildId));
                return;
            }
            case "panel": {
                const channel = options.getChannel("channel", true) as TextChannel;
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