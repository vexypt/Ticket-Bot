import { createResponder, ResponderType } from "#base";
import { db } from "#database";
import { menus } from "#menus";

createResponder({
    customId: "configPermissions/:action",
    types: [ResponderType.RoleSelect], cache: "cached",
    async run(interaction, { action }) {
        
        switch(action) {
            case "configStaffRole": {
                if (interaction.isRoleSelectMenu()) {
                    const { guildId, client, values: [selected] } = interaction;
                    const guild = client.guilds.cache.get(guildId);
                    const role = guild?.roles.cache.get(selected);
                    db.set(`guilds.${guildId}`, { staffRole: selected });

                    await interaction.update(await menus.configPermissions(client, guildId));
                    await interaction.followUp({
                        content: `Cargo de staff configurado para ${role}`,
                        flags: ["Ephemeral"]
                    });
                }
            }
        }
    },
});