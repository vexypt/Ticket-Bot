import { ButtonBuilder, ButtonStyle, Client, type InteractionReplyOptions } from "discord.js";
import { createEmbed, createRow, brBuilder } from "@magicyan/discord";
import { settings } from "#settings";
import { guildDb } from "#database";

export function mainMenu<R>(guildId: string, client: Client): R {

    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if(!guildConfig) {
        guildConfig = { staffRole: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }
    const guild = client.guilds.cache.get(guildId);
    const staffRoleId = guildConfig?.staffRole;
    const staffRole = staffRoleId ? guild?.roles.cache.get(staffRoleId) : null;

    const embed = createEmbed({
        color: settings.colors.azoxo,
        description: brBuilder(
            "# Configure o sistema de tickets",
            `- Cargo de staff: ${staffRole ?? "`Não configurado`"}`,
            "- Configure as categorias de tickets",
            `-# Categoria de suporte: ${guildConfig.supportCategoryId ?? "`Não configurado`"}`,
            `-# Categoria de orçamento: ${guildConfig.budgetCategoryId ?? "`Não configurado`"}`,
            `- Configure o canal de logs de tickets: ${guildConfig.ticketLogChannelId ?? "`Não configurado`"}`,
        )
    });

    const row = createRow(
        new ButtonBuilder({
            customId: "configTicket/menuConfigStaffRole",
            label: "Configurar cargo de Staff",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "configTicket/MenuConfigCategorys",
            label: "Configurar categorias",
            style: ButtonStyle.Secondary,
        }),
        new ButtonBuilder({
            customId: "configTicket/MenuConfigLogChannel",
            label: "Configurar canal de logs",
            style: ButtonStyle.Secondary,
        })
    );

    return ({
        embeds: [embed],
        flags: ["Ephemeral"],
        components: [row]
    } satisfies InteractionReplyOptions) as R;
}