export interface GuildData {
    staffRole?: string | null;            // Cargo de staff
    supportCategoryId?: string | null;   // ID da categoria de suporte
    budgetCategoryId?: string | null;    // ID da categoria de orçamento
    LogChannelId?: string | null;  // ID do canal de logs de tickets
}

export interface TicketData {
    type?: "support" | "budget";        // Tipo do ticket
    createdBy?: string;                  // ID do usuário que criou o ticket
    priorityLevel?: number;              // Nível de prioridade (padrão 0)
    assumedBy?: string | null;           // ID do usuário que assumiu o ticket
    users?: string[];             // Array de IDs dos usuários no ticket
    callChannelId?: string | null;        // ID do canal de chamada de atendimento
    callMessageId?: string | null;        // ID da mensagem de chamada de atendimento
}