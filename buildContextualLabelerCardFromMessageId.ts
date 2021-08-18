function buildContextualLabelerCardFromMessageId(messageId: string): GoogleAppsScript.Card_Service.CardBuilder {
    if (!messageId) {
        return buildContextualLabelerCardEmptyView();
    }

    const message = GmailApp.getMessageById(messageId);

    if (!message) {
        throw new Error(`Message not found: ${messageId}`);
    }

    const thread = message.getThread();

    return buildContextualLabelerCardFromThreadId(thread.getId());
}
