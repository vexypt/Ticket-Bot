import { createCommand } from "#base";
import { menus } from "#menus";
import { ApplicationCommandOptionType, ApplicationCommandType } from "discord.js";

createCommand({
    name: "config",
    nameLocalizations: {
        "pt-BR": "configurar"
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
        }
    ],
    type: ApplicationCommandType.ChatInput,
    async run(interaction) {
        const { options, guildId, client } = interaction;
        
        switch (options.getSubcommand(true)) {
            case "permissions": {
                interaction.reply(await menus.configPermissions(client, guildId));
                return;
            }
        }
    }
});