import { ticketDb } from "#database";
import { TextChannel, ChannelType, Client } from "discord.js";

export async function monitorVoiceChannel(callChannelId: string, ticketId: string, guildId: string, client: Client) {
    while (true) {
        try {
            // Espera 20 segundos antes de verificar novamente
            await new Promise((resolve) => setTimeout(resolve, 20000));

            const callChannel = await client.channels.fetch(callChannelId);
            if (!callChannel || callChannel.type !== ChannelType.GuildVoice) {
                break;
            }

            // Se o canal não tiver membros, deletar o canal e encerrar o monitoramento
            if (callChannel.members.size === 0) {

                try {
                    await callChannel.delete();
                } catch { }

                // Deletar a mensagem associada
                try {
                    const ticketData = ticketDb.get(`tickets.${guildId}.${ticketId}`);
                    const callMessageId = ticketData?.callMessageId;
                    if (callMessageId) {
                        const textChannel = client.channels.cache.get(ticketId) as TextChannel;
                        const callMessage = await textChannel?.messages.fetch(callMessageId);
                        if (callMessage) {
                            await callMessage.delete();
                        }
                    }
                } catch { }

                // Limpeza dos dados do ticket no banco
                ticketDb.delete(`tickets.${guildId}.${ticketId}.callChannelId`);
                ticketDb.delete(`tickets.${guildId}.${ticketId}.callMessageId`);

                break; // Sair do loop após deletar o canal
            }
        } catch (error) {
            break; // Sair do loop em caso de erro crítico
        }
    }
}