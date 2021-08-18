function onOpenAddon(): GoogleAppsScript.Card_Service.Card[] {
    const cardBuilder = CardService.newCardBuilder().setName('Homepage');

    const card = cardBuilder
        .addSection(
            CardService.newCardSection().addWidget(
                CardService.newTextButton()
                    .setText('Open Labeler')
                    .setOnClickAction(CardService.newAction().setFunctionName('gotoLabeler'))
            )
        )
        .build();

    return [card];
}
