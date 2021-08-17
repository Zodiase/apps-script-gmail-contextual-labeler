function buildContextualLabelerCard(labelModel: LabelModel, threadId: string): GoogleAppsScript.Card_Service.Card {
    return [...labelModel.rootLabels.values()]
        .reduce(
            // For every root label, create a new section with its child labels.
            (card, rootLabel) => {
                // Skip not selected root labels.
                if (!rootLabel.selected) {
                    return card;
                }

                return card.addSection(
                    [...rootLabel.childLabels.values()].reduce(
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
                    )
                );
            },
            CardService.newCardBuilder()
            // .setHeader(CardService.newCardHeader().setTitle('Contextual Labeler'))
            // .addSection(
            //     CardService.newCardSection()
            //         .setHeader('Debug')
            //         .addWidget(
            //             CardService.newTextParagraph().setText(
            //                 JSON.stringify(
            //                     labelModel,
            //                     (key, value) => {
            //                         if (value instanceof Map) {
            //                             return [...value.entries()];
            //                         }

            //                         return value;
            //                     },
            //                     4
            //                 )
            //             )
            //         )
            // )
        )
        .build();
}
