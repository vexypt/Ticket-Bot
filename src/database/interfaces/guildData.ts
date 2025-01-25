export interface GuildData {
    staffRole?: string | null;            // Cargo de staff
    supportCategoryId?: string | null;   // ID da categoria de suporte
    budgetCategoryId?: string | null;    // ID da categoria de orçamento
    ticketLogChannelId?: string | null;  // ID do canal de logs de tickets
}

export interface TicketData {
    priorityLevel?: number;              // Nível de prioridade (padrão 0)
    closed?: boolean;                    // Indica se o ticket foi fechado
    assumedBy?: string | null;           // ID do usuário que assumiu o ticket
    participants?: string[];             // Array de IDs dos usuários no ticket
}