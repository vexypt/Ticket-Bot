import { createResponder, ResponderType } from "#base";
import { guildDb, ticketDb } from "#database";
import { res } from "#functions";
import { menus } from "#menus";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";

createResponder({
    customId: "ticketSec/:type/:action",
    types: [ResponderType.Button, ResponderType.UserSelect], cache: "cached",
    async run(interaction, { type, action }) {
        
        const { guild, guildId } = interaction;

        switch (type) {
            case "button": {
                if (interaction.isButton()) {
                    switch (action) {
                        case "addUser": {
                            const ticketChannel = interaction.channel;
                            if(!ticketChannel) {
                                interaction.reply({
                                    content: "Este canal não é um canal de ticket válido",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }
    
                            const ticketData = ticketDb.get(`tickets.${ticketChannel.id}`);
                            if(!ticketData) {
                                interaction.reply({
                                    content: "Não foi possível encontrar os dados do ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }
    
                            const currentUsers = ticketData.users ? [...ticketData.users] : [];
    
                            // Incluindo os usuários com o cargo de staff
                            const staffRoleId = guildId && guildDb.get(`guilds.${guildId}`)?.staffRole;
                            const staffMembers = staffRoleId ? guild?.roles.cache.get(staffRoleId)?.members.map(member => member.id) ?? [] : [];
                            const allUsers = Array.from(new Set([...currentUsers, ...staffMembers]));
    
                            await interaction.deferUpdate();
                            await interaction.followUp(menus.ticket.secondaryPanel.addUser(allUsers));
    
                            return;
                        }
                        case "removeUser": {
                            const ticketChannel = interaction.channel;
                            if(!ticketChannel) {
                                interaction.reply({
                                    content: "Este canal não é um canal de ticket válido",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }
    
                            const ticketData = ticketDb.get(`tickets.${ticketChannel.id}`);
                            if(!ticketData) {
                                interaction.reply({
                                    content: "Não foi possível encontrar os dados do ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }
    
                            const currentUsers = ticketData.users ? [...ticketData.users] : [];
    
                            // Incluindo os usuários com o cargo de staff
                            const staffRoleId = guildId && guildDb.get(`guilds.${guildId}`)?.staffRole;
                            const staffMembers = staffRoleId ? guild?.roles.cache.get(staffRoleId)?.members.map(member => member.id) ?? [] : [];
                            const allUsers = Array.from(new Set([...currentUsers, ...staffMembers]));
    
                            await interaction.deferUpdate();
                            await interaction.followUp(menus.ticket.secondaryPanel.removeUser(allUsers));
    
                            return;
                        }
                        case "NotfUser": {
                            const ticketChannel = interaction.channel as TextChannel;
                            if(!ticketChannel) {
                                interaction.reply({
                                    content: "Este canal não é um canal de ticket válido",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }
                            const ticketChannelButton = createRow(
                                new ButtonBuilder({
                                    style: ButtonStyle.Link,
                                    label: "Ir para o ticket",
                                    url: ticketChannel.url,
                                })
                            );

                            const ticketData = ticketDb.get(`tickets.${ticketChannel.id}`);
                            if(!ticketData) {
                                interaction.reply({
                                    content: "Não foi possível encontrar os dados do ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const creatorId = ticketData.createdBy;
                            if(!creatorId) {
                                interaction.reply({
                                    content: "Não foi possível indentificar o criador do ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const creator = await guild!.members.fetch(creatorId);

                            if(creator) {
                                // Tentar enviar a mensagem
                                creator.send(
                                    res.warning(`Seu ticket foi atendido! Nossa equipe de suporte está te aguardando em ${ticketChannel}`, {
                                        components: [ticketChannelButton],
                                        ephemeral: true,
                                    })
                                ).then(() => {
                                    interaction.reply({
                                        content: "O usuário foi notificado com sucesso!",
                                        flags: ["Ephemeral"],
                                    });
                                }).catch(() => {
                                    interaction.reply({
                                        content: "Não foi possível notificar o usuário, as DM's do usuário estão desativadas.",
                                        flags: ["Ephemeral"],
                                    });
                                })
                            } else {
                                interaction.reply({
                                    content: "Não foi possível notificar o usuário",
                                    flags: ["Ephemeral"],
                                });
                            }
                            return;
                        }
                        case "AssumTicket": {
                            
                        }
                        case "createCall":
                            // Criar chamada
                            break;
                        case "moveChannel":
                            // Mover canal
                            break;
                        case "defPriority":
                            // Definir prioridade
                            break;
                        case "leaveTicket":
                            // Sair ou cancelar
                            break;
                    }
                }
            }

            case "select": {
                if(interaction.isAnySelectMenu()) {
                    const { values: [selected] } = interaction;
                    switch(action) {
                        case "addUser": {
                            if(interaction.isUserSelectMenu()) {

                                const ticketChannel = interaction.channel as TextChannel;
                                if(!ticketChannel) {
                                    interaction.reply({
                                        content: "Este canal não é um canal de ticket válido",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Obter os dados do ticket
                                const ticketData = ticketDb.get(`tickets.${ticketChannel.id}`);
                                if(!ticketData) {
                                    interaction.reply({
                                        content: "Não foi possível encontrar os dados do ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Verificar cargos da staff
                                const staffRoleId = guildId && guildDb.get(`guilds.${guildId}`)?.staffRole;
                                const staffMembers = staffRoleId ? guild?.roles.cache.get(staffRoleId)?.members.map(member => member.id) ?? [] : [];

                                // Adicionando o usuário selecionado ao ticket
                                const newUserId = selected;
                                if(ticketData.users && ticketData.users.includes(newUserId) || staffMembers.includes(newUserId)) {
                                    interaction.reply({
                                        content: "Este usuário já está no ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Atualizar a lista de usuários do ticket
                                const updatedUsers = [...(ticketData.users || []), newUserId];
                                ticketDb.set(`tickets.${ticketChannel.id}`, {
                                    ...ticketData,
                                    users: updatedUsers,
                                });

                                // Carregar todos os usuarios
                                const allUsers = Array.from(new Set([...updatedUsers, ...staffMembers]));

                                // Editar as permissões do canal
                                await ticketChannel.permissionOverwrites.edit(newUserId, {
                                    ViewChannel: true,
                                    ReadMessageHistory: true,
                                    AttachFiles: true,
                                    EmbedLinks: true,
                                    SendMessages: true,
                                });

                                await interaction.update(menus.ticket.secondaryPanel.addUser(allUsers));
                            }
                            return;
                        }
                        case "removeUser": {
                            if(interaction.isUserSelectMenu()) {

                                const ticketChannel = interaction.channel as TextChannel;
                                if(!ticketChannel) {
                                    interaction.reply({
                                        content: "Este canal não é um canal de ticket válido",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Obter os dados do ticket
                                const ticketData = ticketDb.get(`tickets.${ticketChannel.id}`);
                                if(!ticketData) {
                                    interaction.reply({
                                        content: "Não foi possível encontrar os dados do ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Verificar cargos da staff
                                const staffRoleId = guildId && guildDb.get(`guilds.${guildId}`)?.staffRole;
                                const staffMembers = staffRoleId ? guild?.roles.cache.get(staffRoleId)?.members.map(member => member.id) ?? [] : [];

                                // Adicionando o usuário selecionado ao ticket
                                const userIdToRemove = selected;
                                if (staffMembers.includes(userIdToRemove)) {
                                    interaction.reply({
                                        content: "Você não pode remover um membro da equipe do ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                if(!ticketData.users || !ticketData.users.includes(userIdToRemove)) {
                                    interaction.reply({
                                        content: "Este usuário não está no ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                // Atualizar a lista de usuários do ticket
                                const updatedUsers = ticketData.users.filter(userId => userId !== userIdToRemove);
                                ticketDb.set(`tickets.${ticketChannel.id}`, {
                                    ...ticketData,
                                    users: updatedUsers,
                                });

                                // Carregar todos os usuarios
                                const allUsers = Array.from(new Set([...updatedUsers, ...staffMembers]));

                                // Editar as permissões do canal
                                await ticketChannel.permissionOverwrites.edit(userIdToRemove, {
                                    ViewChannel: false,
                                    ReadMessageHistory: false,
                                    AttachFiles: false,
                                    EmbedLinks: false,
                                    SendMessages: false,
                                });

                                await interaction.update(menus.ticket.secondaryPanel.removeUser(allUsers));
                            }
                            return;
                        }
                    }
                }
            }
        }
    },
});