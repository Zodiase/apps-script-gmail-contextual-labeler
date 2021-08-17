/**
 * This is triggered when:
 * 1. user starts the addon while viewing a message,
 * 2. user opens a message while the addon is open.
 */
function onOpenAnyGmailMessage(e: GoogleAppsScript.Addons.EventObject): GoogleAppsScript.Card_Service.Card[] {
    // Activate temporary Gmail scopes, in this case to allow message metadata to be read.
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const messageId = e.gmail.messageId;
    const message = GmailApp.getMessageById(messageId);
    const userLabels = GmailApp.getUserLabels();
    const thread = message.getThread();
    const labelsInThread = thread.getLabels();
    const labelModel = getLabelModel(userLabels, labelsInThread);

    const contextualLabelerCard = [...labelModel.rootLabels.values()].reduce(
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
                                                .setParameters({
                                                    action: childLabel.selected ? 'remove' : 'add',
                                                    threadId: thread.getId(),
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
            .addSection(
                CardService.newCardSection()
                    .setHeader('Debug')
                    .addWidget(CardService.newTextParagraph().setText(JSON.stringify(labelModel, null, 4)))
            )
    );

    return [contextualLabelerCard].map((card) => card.build());
}
