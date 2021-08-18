function buildContextualLabelerCard(labelModel: LabelModel, threadId: string): GoogleAppsScript.Card_Service.Card {
    const selectedRootLabels = [...labelModel.rootLabels.values()].filter((rootLabel) => rootLabel.selected);
    const selectedRootLabelsWithValidChildren = selectedRootLabels.filter(
        (rootLabel) => rootLabel.childLabels.size > 0
    );

    // No root labels.
    if (selectedRootLabels.length === 0) {
        return CardService.newCardBuilder()
            .addSection(
                CardService.newCardSection().setHeader('No available labels').addWidget(
                    //! Maybe add a help guide here.
                    CardService.newTextParagraph().setText('Start by attaching some labels to the email thread.')
                )
            )
            .build();
    }
    // No child labels.
    if (selectedRootLabelsWithValidChildren.length === 0) {
        return CardService.newCardBuilder()
            .addSection(
                CardService.newCardSection().setHeader('No available labels').addWidget(
                    //! Maybe add a help guide here.
                    CardService.newTextParagraph().setText('None of the attached labels has applicable child labels.')
                )
            )
            .build();
    }

    const cardBuilder = selectedRootLabelsWithValidChildren.reduce(
        // For every root label, add a new section with its child labels.
        (card, rootLabel) => {
            if (rootLabel.childLabels.size === 0) {
                return card;
            }

            const childLabels = [...rootLabel.childLabels.values()];
            const newCardSection = childLabels.reduce(
                // For every child label, add a new widget to toggle it.
                // Note that "you can't add more than 100 widgets to a card section". See https://developers.google.com/apps-script/reference/card-service/card-section#addwidgetwidget.
                (section, childLabel) =>
                    section.addWidget(
                        CardService.newDecoratedText()
                            .setText(childLabel.name)
                            .setSwitchControl(
                                CardService.newSwitch()
                                    .setFieldName('label-switch')
                                    .setValue(childLabel.fullName)
                                    .setControlType(CardService.SwitchControlType.CHECK_BOX)
                                    .setSelected(childLabel.selected)
                                    .setOnChangeAction(
                                        CardService.newAction()
                                            .setFunctionName('onSwitchLabelForThread')
                                            .setLoadIndicator(CardService.LoadIndicator.SPINNER)
                                            .setParameters({
                                                action: childLabel.selected ? 'remove' : 'add',
                                                threadId,
                                                labelName: childLabel.fullName,
                                            } as SwitchLabelForThreadProps as any)
                                    )
                            )
                    ),
                CardService.newCardSection().setHeader(rootLabel.name)
            );

            return card.addSection(newCardSection);
        },
        CardService.newCardBuilder()
    );

    return cardBuilder.build();
}
