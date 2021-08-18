function buildContextualLabelerCardEmptyView(): GoogleAppsScript.Card_Service.CardBuilder {
    const cardBuilder = buildContextualLabelerCardBase();

    return cardBuilder.addSection(
        CardService.newCardSection()
            .setHeader('Labeler unavailable')
            .addWidget(CardService.newTextParagraph().setText('Open an email to use the labeler.'))
    );
}
