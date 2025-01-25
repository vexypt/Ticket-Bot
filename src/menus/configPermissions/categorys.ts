import { guildDb } from "#database";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { type InteractionReplyOptions, Client, ChannelSelectMenuBuilder, ChannelType } from "discord.js";

export async function configCategoryMenu<R>(client: Client, guildId: string): Promise<R> {
    // Busca as configurações da guilda no banco de dados
    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if (!guildConfig) {
        guildConfig = { supportCategoryId: null, budgetCategoryId: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }

    const guild = client.guilds.cache.get(guildId);

    // Obtém as IDs das categorias configuradas
    const supportCategoryId = guildConfig?.supportCategoryId;
    const budgetCategoryId = guildConfig?.budgetCategoryId;

    // Busca as categorias no cache do servidor
    const supportCategory = supportCategoryId
        ? guild?.channels.cache.get(supportCategoryId) ?? "`Não configurado`"
        : "`Não configurado`";
    const budgetCategory = budgetCategoryId
        ? guild?.channels.cache.get(budgetCategoryId) ?? "`Não configurado`"
        : "`Não configurado`";

    // Embed para exibir as configurações atuais
    const embedConfig = createEmbed({
        color: settings.colors.azoxo,
        title: "Configuração de Categorias",
        description: `- **Categoria de Suporte:** ${supportCategory}\n- **Categoria de Orçamento:** ${budgetCategory}`,
    });

    // Cria menus de seleção para configurar as categorias
    const row1 = createRow(
        new ChannelSelectMenuBuilder({
            customId: "configTicket/configSupportCategory",
            placeholder: "Selecione a categoria de suporte",
            channelTypes: [ChannelType.GuildCategory], // Somente categorias
            minValues: 1,
            maxValues: 1,
        }),
    );

    const row2 = createRow(
        new ChannelSelectMenuBuilder({
            customId: "configTicket/configBudgetCategory",
            placeholder: "Selecione a categoria de orçamento",
            channelTypes: [ChannelType.GuildCategory], // Somente categorias
            minValues: 1,
            maxValues: 1,
        })
    );

    // Retorna a configuração para interação
    return ({
        flags: ["Ephemeral"],
        embeds: [embedConfig],
        components: [row1, row2],
    } satisfies InteractionReplyOptions) as R;
}
