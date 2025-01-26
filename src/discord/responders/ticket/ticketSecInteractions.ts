import { createResponder, ResponderType } from "#base";
import { guildDb, ticketDb } from "#database";
import { monitorVoiceChannel, res } from "#functions";
import { menus } from "#menus";
import { createRow } from "@magicyan/discord";
import { ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits, TextChannel } from "discord.js";

createResponder({
    customId: "ticketSec/:type/:action",
    types: [ResponderType.Button, ResponderType.UserSelect, ResponderType.StringSelect], cache: "cached",
    async run(interaction, { type, action }) {
        
        const { guild, guildId, user, member, client } = interaction;

        switch (type) {
            case "button": {
                if (interaction.isButton()) {
                    switch (action) {
                        case "addUser": {

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel;
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

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel;
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

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

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

                            const ticketData = ticketDb.get(`tickets.${guildId}.${ticketChannel.id}`);
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

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel as TextChannel;
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

                            // Marcar o ticket como assumido
                            ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
                                ...ticketData,
                                assumedBy: user.id,
                            });
                            await interaction.update(menus.ticket.secondaryMenu(interaction, user.id));
                            await ticketChannel.send(res.azoxo(`Atendimento assumido. ${user} estará à disposição para auxiliá-lo(a).`));

                            return;
                        }
                        case "createCall": {

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel as TextChannel;
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

                            const creatorId = ticketData.createdBy;
                            if(!creatorId) {
                                interaction.reply({
                                    content: "Não foi possível indentificar o criador do ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const creator = await guild!.members.fetch(creatorId);
                            const userName = creator ? creator.user.username : "Usuário";

                            // Verificar se já existe um canal de atendimento
                            const existingCallChannelId = ticketData.callChannelId;
                            if (existingCallChannelId) {
                                const existingCallChannel = await guild!.channels.fetch(existingCallChannelId).catch(() => {
                                    // Remover o ID do canal de atendimento do banco de dados
                                    ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
                                        ...ticketData,
                                        callChannelId: null,
                                        callMessageId: null,
                                    });
                                });
                                if (existingCallChannel) {
                                    interaction.reply({
                                        content: `Já existe um canal de atendimento criado: ${existingCallChannel}`,
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }
                            }

                            // Limitar o nome do canal para 100 caracteres
                            let channelName = `🔊 Atendimento ${userName}`;
                            if (channelName.length > 100) {
                                channelName = `${channelName.slice(0, 97)}...`;
                            }

                            // Criar o canal de voz
                            const voiceChannel = await guild.channels.create({
                                name: channelName,
                                type: ChannelType.GuildVoice,
                                parent: ticketChannel.parentId, // Coloca o canal na mesma categoria do ticket
                                permissionOverwrites: [
                                    {
                                        id: guild.roles.everyone.id,
                                        deny: [PermissionFlagsBits.ViewChannel]
                                    },
                                    {
                                        id: creatorId,
                                        allow: [
                                            PermissionFlagsBits.ViewChannel,
                                            PermissionFlagsBits.SendMessages,
                                            PermissionFlagsBits.ReadMessageHistory,
                                            PermissionFlagsBits.AttachFiles,
                                            PermissionFlagsBits.EmbedLinks,
                                            PermissionFlagsBits.Connect,
                                            PermissionFlagsBits.Speak,
                                        ]
                                    },
                                    {
                                        id: guildConfig.staffRole!,
                                        allow: [
                                            PermissionFlagsBits.ViewChannel,
                                            PermissionFlagsBits.ReadMessageHistory,
                                            PermissionFlagsBits.AttachFiles,
                                            PermissionFlagsBits.EmbedLinks,
                                            PermissionFlagsBits.Connect,
                                            PermissionFlagsBits.Speak,
                                        ]
                                    }
                                ],
                            });

                            await interaction.deferUpdate();
                            const callMessage = await ticketChannel.send(res.azoxo(`Chamada de atendimento criada ${voiceChannel}.`));

                            // Salvar o ID da mensagem de atendimento no banco de dados
                            ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
                                ...ticketData,
                                callChannelId: voiceChannel.id,
                                callMessageId: callMessage.id
                            });

                            // Background...
                            // Garantir que todos os usuários do ticket também tenham acesso
                            const ticketUsers = ticketData.users || [];
                            const allUsersIds = [creatorId, user.id, ...ticketUsers];

                            // Atualizar permissões de todos os usuários de uma vez (Espero que não dê ratelimit)
                            await voiceChannel.permissionOverwrites.set(
                                allUsersIds.map((userId) => ({
                                    id: userId,
                                    allow: [
                                        PermissionFlagsBits.ViewChannel,
                                        PermissionFlagsBits.ReadMessageHistory,
                                        PermissionFlagsBits.AttachFiles,
                                        PermissionFlagsBits.EmbedLinks,
                                        PermissionFlagsBits.Connect,
                                        PermissionFlagsBits.Speak,
                                    ]
                                }))
                            );

                            await monitorVoiceChannel(voiceChannel.id, ticketChannel.id, guildId, client);
                            return;
                        }
                        case "moveChannel": {

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel;
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
    
                            await interaction.deferUpdate();
                            await interaction.followUp(menus.ticket.secondaryPanel.moveChannel(guildId));
    
                            return;
                        }
                        case "defPriority": {

                            const guildConfig = guildDb.get(`guilds.${guildId}`);
                            if(!guildConfig) {
                                interaction.reply({
                                    content: "Não foi possível encontrar as configurações do servidor.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            if(guildConfig.staffRole && !member?.roles.cache.has(guildConfig.staffRole)) {
                                interaction.reply({
                                    content: "Você não tem permissão para assumir este ticket.",
                                    flags: ["Ephemeral"],
                                });
                                return;
                            }

                            const ticketChannel = interaction.channel;
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
    
                            await interaction.deferUpdate();
                            await interaction.followUp(menus.ticket.secondaryPanel.choosePriority(guildId));
    
                            return;
                        }
                    }
                }
            }

            case "select": {
                if(interaction.isAnySelectMenu()) {
                    const { values: [selected], channel } = interaction;
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
                                const ticketData = ticketDb.get(`tickets.${guildId}.${ticketChannel.id}`);
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
                                ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
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
                                const ticketData = ticketDb.get(`tickets.${guildId}.${ticketChannel.id}`);
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
                                ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
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
                        case "moveChannel": {
                            if(interaction.isStringSelectMenu()) {

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

                                const selectedCategoryId = selected;
                                const selectedCategory = guild?.channels.cache.get(selectedCategoryId);

                                if(!selectedCategory || selectedCategory.type !== ChannelType.GuildCategory) {
                                    interaction.reply({
                                        content: "Categoria inválida.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                if(ticketChannel.parentId === selectedCategoryId) {
                                    interaction.reply({
                                        content: "O canal já está nesta categoria.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                try {
                                    // Move o canal para a categoria selecionada
                                    await ticketChannel.setParent(selectedCategoryId);
                                    interaction.reply({
                                        content: `Canal movido com sucesso!`,
                                        flags: ["Ephemeral"],
                                    });
                                    ticketChannel.send(res.azoxo(`O canal foi movido para a categoria de **${selectedCategory.name}**`));
                                } catch (error){
                                    interaction.reply({
                                        content: "Não foi possível mover o canal.",
                                        flags: ["Ephemeral"],
                                    });
                                }
                            }
                            return;
                        }
                        case "defPriority": {
                            if(interaction.isStringSelectMenu()) {

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

                                const selectedPriority = parseInt(selected, 10);
                                let priorityEmoji = "";
                                let priorityLabel = "";

                                switch (selectedPriority) {
                                    case 3:
                                        priorityEmoji = "🔴";
                                        priorityLabel = "Alta";
                                        break;
                                    case 2:
                                        priorityEmoji = "🟠";
                                        priorityLabel = "Média";
                                        break;
                                    case 1:
                                        priorityEmoji = "🔵";
                                        priorityLabel = "Baixa";
                                        break;
                                }

                                if(ticketData.priorityLevel === selectedPriority) {
                                    interaction.reply({
                                        content: `O ticket já está com a prioridade ${priorityEmoji} **${priorityLabel}**`,
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }

                                const ticketCreatorId = ticketData.createdBy;
                                if (!ticketCreatorId) {
                                    interaction.reply({
                                        content: "Não foi possível identificar o criador do ticket.",
                                        flags: ["Ephemeral"],
                                    });
                                    return;
                                }
                                const ticketCreator = await guild!.members.fetch(ticketCreatorId);
                                try {
                                    const newChannelName = `${priorityEmoji}┃${ticketCreator?.user.username}`;
                                    await channel?.setName(newChannelName);
                                    ticketDb.set(`tickets.${guildId}.${ticketChannel.id}`, {
                                        ...ticketData,
                                        priorityLevel: selectedPriority,
                                    });
                                } catch(error) {
                                    interaction.update({
                                        content: "Não atualize a prioridade tão rápido!."
                                    });
                                }

                                await interaction.reply({
                                    content: `Prioridade do ticket definida como ${priorityEmoji} **${priorityLabel}**`,
                                    flags: ["Ephemeral"],
                                });
                            }
                            return;
                        }
                    }
                }
            }
        }
    },
});