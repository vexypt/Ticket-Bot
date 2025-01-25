import { createResponder, ResponderType } from "#base";
import { db } from "#database";
import { menus } from "#menus";

createResponder({
    customId: "configTicket/:action",
    types: [ResponderType.RoleSelect, ResponderType.ChannelSelect], // Suporte a seletores de cargo e canal
    cache: "cached",
    async run(interaction, { action }) {
        const { guildId, client } = interaction;

        switch (action) {
            case "configStaffRole": {
                if (interaction.isRoleSelectMenu()) {
                    const [selected] = interaction.values;

                    // Recupera os dados atuais e atualiza apenas o staffRole
                    const currentConfig = db.get(`guilds.${guildId}`) || {};
                    db.set(`guilds.${guildId}`, { ...currentConfig, staffRole: selected });

                    // Atualiza o menu de permissões após configurar
                    await interaction.update(await menus.config.permissions(client, guildId));
                }
                return;
            }

            case "configSupportCategory": {
                if (interaction.isChannelSelectMenu()) {
                    const [selected] = interaction.values;

                    // Recupera os dados atuais e atualiza apenas o supportCategoryId
                    const currentConfig = db.get(`guilds.${guildId}`) || {};
                    db.set(`guilds.${guildId}`, { ...currentConfig, supportCategoryId: selected });

                    // Atualiza o menu de permissões após configurar
                    await interaction.update(await menus.config.permissions(client, guildId));
                }
                return;
            }

            case "configBudgetCategory": {
                if (interaction.isChannelSelectMenu()) {
                    const [selected] = interaction.values;

                    // Recupera os dados atuais e atualiza apenas o budgetCategoryId
                    const currentConfig = db.get(`guilds.${guildId}`) || {};
                    db.set(`guilds.${guildId}`, { ...currentConfig, budgetCategoryId: selected });

                    // Atualiza o menu de permissões após configurar
                    await interaction.update(await menus.config.permissions(client, guildId));
                }
                return;
            }

            default: {
                // Caso para ações desconhecidas
                await interaction.reply({
                    content: "Ação inválida ou não implementada.",
                    flags: ["Ephemeral"],
                });
                return;
            }
        }
    },
});