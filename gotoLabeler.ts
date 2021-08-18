function gotoLabeler(e: GoogleAppsScript.Addons.EventObject): GoogleAppsScript.Card_Service.ActionResponse {
    // Activate temporary Gmail scopes, in this case to allow message metadata to be read.
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const contextualLabelerCard = buildContextualLabelerCardFromMessageId(e.gmail.messageId);

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(contextualLabelerCard.build()))
        .build();
}
