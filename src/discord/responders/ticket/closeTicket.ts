import { createResponder, ResponderType } from "#base";
import { guildDb, ticketDb } from "#database";
import { settings } from "#settings";
import { brBuilder, createEmbed, createRow } from "@magicyan/discord";
import { createTranscript } from "discord-html-transcripts";
import { ButtonBuilder, ButtonStyle, ChannelType, TextChannel } from "discord.js";

createResponder({
    customId: "closeTicket/:reason",
    types: [ResponderType.Button], cache: "cached",
    async run(interaction, { reason }) {
        const { member, channel, guildId, guild } = interaction;

        switch (reason) {
            case "cancel": {
                const guildConfig = guildDb.get(`guilds.${guildId}`);
                if(!guildConfig) {
                    interaction.reply({
                        content: "Não foi possível encontrar as configurações do servidor.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const ticketChannel = channel as TextChannel;
                if(!ticketChannel) {
                    interaction.reply({
                        content: "Este canal não é um canal de ticket válido",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const ticketData = ticketDb.get(`tickets.${guildId}.${ticketChannel.id}`);
                if(!ticketData) {
                    interaction.reply({
                        content: "Não foi possível encontrar os dados do ticket.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const logChannelId = guildConfig.LogChannelId;
                if(!logChannelId) {
                    interaction.reply({
                        content: "O canal de logs não foi configurado.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }
                const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
                const ticketCreatorId = ticketData.createdBy;
                if(!ticketCreatorId) {
                    interaction.reply({
                        content: "Não foi possível encontrar o criador do ticket.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }
                const ticketCreator = guild.members.cache.get(ticketCreatorId);
                const transcriptEmbed = createEmbed({
                    title: "Ticket Cancelado!",
                    description: brBuilder(
                        `> Usuário que cancelou: ${member}/${member.id}`,
                        `> Horario de cancelamento: ${new Date().toLocaleString("pt-BR")}`,
                        `> Criador do Ticket: ${ticketCreator}/${ticketCreator?.id}`
                    ),
                    footer: { text: "Para acessar o registro, clique no botão abaixo" },
                    color: settings.colors.danger,
                });

                const file = await createTranscript(ticketChannel as any, {
                    limit: -1,
                    filename: `transcript-${ticketChannel.name}.html`
                });

                ticketChannel.permissionOverwrites.edit(ticketCreatorId, {
                    ViewChannel: false,
                    SendMessages: false,
                })

                ticketChannel.send({
                    content: "Finalizando atendimento, agradecemos o contato..."
                });

                await new Promise(resolve => setTimeout(resolve, 5_000));

                let msg = await logChannel.send({ files: [file] });
                
                const row = createRow(
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        label: "Ver registro",
                        url: `https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`,
                    }),
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        label: "Download Registro",
                        url: msg.attachments.first()?.url,
                    })
                )

                await logChannel.send({
                    embeds: [transcriptEmbed],
                    components: [row]
                });
                try {
                    ticketCreator?.send({
                        embeds: [transcriptEmbed],
                        components: [row]
                    })
                } catch { }

                try {
                    ticketChannel.delete();
                    ticketDb.delete(`tickets.${guildId}.${ticketChannel.id}`);
                } catch {}

                return;
            }
            case "finish": {

                const guildConfig = guildDb.get(`guilds.${guildId}`);
                if(!guildConfig) {
                    interaction.reply({
                        content: "Não foi possível encontrar as configurações do servidor.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const ticketChannel = channel as TextChannel;
                if(!ticketChannel || ticketChannel.type !== ChannelType.GuildText) {
                    interaction.reply({
                        content: "Este canal não é um canal de ticket válido",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const ticketData = ticketDb.get(`tickets.${guildId}.${ticketChannel.id}`);
                if(!ticketData) {
                    interaction.reply({
                        content: "Não foi possível encontrar os dados do ticket.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }

                const logChannelId = guildConfig.LogChannelId;
                if(!logChannelId) {
                    interaction.reply({
                        content: "O canal de logs não foi configurado.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }
                const logChannel = guild.channels.cache.get(logChannelId) as TextChannel;
                const ticketCreatorId = ticketData.createdBy;
                if(!ticketCreatorId) {
                    interaction.reply({
                        content: "Não foi possível encontrar o criador do ticket.",
                        flags: ["Ephemeral"],
                    });
                    return;
                }
                const ticketCreator = guild.members.cache.get(ticketCreatorId);
                const transcriptEmbed = createEmbed({
                    title: "Ticket Finalizado com sucesso!",
                    description: brBuilder(
                        `> Staff que finalizou: ${member}/${member.id}`,
                        `> Horario de finalização: ${new Date().toLocaleString("pt-BR")}`,
                        `> Criador do Ticket: ${ticketCreator}/${ticketCreator?.id}`
                    ),
                    footer: { text: "Para acessar o registro, clique no botão abaixo" },
                    color: settings.colors.success
                });

                const file = await createTranscript(ticketChannel as any, {
                    limit: -1,
                    filename: `transcript-${ticketChannel.name}.html`
                });

                ticketChannel.permissionOverwrites.edit(ticketCreatorId, {
                    ViewChannel: false,
                    SendMessages: false,
                })

                ticketChannel.send({
                    content: "Finalizando atendimento, agradecemos o contato..."
                });

                await new Promise(resolve => setTimeout(resolve, 5_000));

                let msg = await logChannel.send({ files: [file] });
                
                const row = createRow(
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        label: "Ver registro",
                        url: `https://mahto.id/chat-exporter?url=${msg.attachments.first()?.url}`,
                    }),
                    new ButtonBuilder({
                        style: ButtonStyle.Link,
                        label: "Download Registro",
                        url: msg.attachments.first()?.url,
                    })
                )

                await logChannel.send({
                    embeds: [transcriptEmbed],
                    components: [row]
                });
                try {
                    ticketCreator?.send({
                        embeds: [transcriptEmbed],
                        components: [row]
                    })
                } catch { }

                try {
                    ticketChannel.delete();
                    ticketDb.delete(`tickets.${guildId}.${ticketChannel.id}`);
                } catch {}

                return;
            }
        }
    },
});