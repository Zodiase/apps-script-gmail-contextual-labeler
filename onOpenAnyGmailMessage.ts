/**
 * This is triggered when:
 * 1. user starts the addon while viewing a message,
 * 2. user opens a message while the addon is open.
 */
function onOpenAnyGmailMessage(e: GoogleAppsScript.Addons.EventObject): GoogleAppsScript.Card_Service.Card[] {
    // Activate temporary Gmail scopes, in this case to allow message metadata to be read.
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const contextualLabelerCard = buildContextualLabelerCardFromMessageId(e.gmail.messageId);

    return [contextualLabelerCard.build()];
}
