import { guildDb } from "#database";
import { settings } from "#settings";
import { createEmbed, createRow } from "@magicyan/discord";
import { type InteractionReplyOptions, Client, ChannelSelectMenuBuilder, ChannelType, ButtonBuilder, ButtonStyle } from "discord.js";

export async function configLogChannelMenu<R>(client: Client, guildId: string): Promise<R> {
    // Busca as configurações da guilda no banco de dados
    let guildConfig = guildDb.get(`guilds.${guildId}`);
    if (!guildConfig) {
        guildConfig = { supportCategoryId: null, budgetCategoryId: null };
        guildDb.set(`guilds.${guildId}`, guildConfig);
    }

    const guild = client.guilds.cache.get(guildId);

    // Obtém as IDs dos canais
    const logChannelId = guildConfig?.LogChannelId

    // Busca as categorias no cache do servidor
    const logChannel = logChannelId
        ? guild?.channels.cache.get(logChannelId) ?? "`Não configurado`"
        : "`Não configurado`";

    // Embed para exibir as configurações atuais
    const embedConfig = createEmbed({
        color: settings.colors.azoxo,
        title: "Configuração de Canais",
        description: `- **Canal de Logs:** ${logChannel}`,
    });

    // Cria menus de seleção para configurar os canais de texto
    const row1 = createRow(
        new ChannelSelectMenuBuilder({
            customId: "configTicket/configLogChannel",
            placeholder: "Selecione o canal de Logs",
            channelTypes: [ChannelType.GuildText], // Somente canais de texto
            minValues: 1,
            maxValues: 1,
        }),
    );

    const row2 = createRow(
        new ButtonBuilder({
            customId: "configTicket/menu",
            label: "Voltar ao menu",
            style: ButtonStyle.Secondary,
        })
    );

    // Retorna a configuração para interação
    return ({
        flags: ["Ephemeral"],
        embeds: [embedConfig],
        components: [row1, row2],
    } satisfies InteractionReplyOptions) as R;
}
