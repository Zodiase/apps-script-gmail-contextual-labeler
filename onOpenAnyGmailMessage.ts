/**
 * This is triggered when:
 * 1. user starts the addon while viewing a message,
 * 2. user opens a message while the addon is open.
 */
function onOpenAnyGmailMessage(e: GoogleAppsScript.Addons.EventObject) {
    console.log('Hello world!', e);

    //! Implement a contextual trigger function that builds a message UI when the user selects the add-on in a message.

    // Activate temporary Gmail scopes, in this case to allow message metadata to be read.
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    const data = ((messageId) => {
        const userLabels = GmailApp.getUserLabels();
        const message = GmailApp.getMessageById(messageId);
        const thread = message.getThread();
        const labelsInThread = thread.getLabels();
        const labelMapOfThread = labelsInThread.reduce(
            (map, label) => ({ ...map, [label.getName()]: label }),
            {} as { [key: string]: GoogleAppsScript.Gmail.GmailLabel }
        );
        const isLabelSelected = (label: GoogleAppsScript.Gmail.GmailLabel): boolean => {
            return label.getName() in labelMapOfThread;
        };

        return {
            message,
            thread,
            userLabels,
            labelsInThread,
            isLabelSelected,
        };
    })(e.gmail.messageId);

    var subject = data.message.getSubject();
    var sender = data.message.getFrom();

    // Create a card with a single card section and two widgets.
    // Be sure to execute build() to finalize the card construction.
    var exampleCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle('Example card'))
        .addSection(
            CardService.newCardSection()
                .addWidget(CardService.newKeyValue().setTopLabel('Subject').setContent(subject))
                .addWidget(CardService.newKeyValue().setTopLabel('From').setContent(sender))
        )
        .build();

    var contextualLabelerCard = CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle('Contextual Labeler'))
        .addSection(
            CardService.newCardSection()
                .setHeader('Debug')
                .addWidget(
                    CardService.newTextParagraph().setText(
                        JSON.stringify(
                            data,
                            (key, value) => {
                                if (key === 'message') {
                                    const message = value as GoogleAppsScript.Gmail.GmailMessage;
                                    return {
                                        sender: message.getFrom(),
                                        subject: message.getSubject(),
                                    };
                                }
                                if (key === 'thread') {
                                    const thread = value as GoogleAppsScript.Gmail.GmailThread;
                                    return thread.getId();
                                }
                                if (key === 'userLabels') {
                                    const userLabels = value as typeof data.userLabels;
                                    return userLabels.map((label) => label.getName());
                                }
                                if (key === 'labelsInThread') {
                                    const labelsInThread = value as typeof data.labelsInThread;
                                    return labelsInThread.map((label) => label.getName());
                                }
                                return value;
                            },
                            4
                        )
                    )
                )
        )
        .addSection(
            data.userLabels.reduce(
                (section, userLabel) =>
                    section.addWidget(
                        CardService.newDecoratedText()
                            .setText(userLabel.getName())
                            .setSwitchControl(
                                CardService.newSwitch()
                                    .setFieldName('label-switch')
                                    .setValue(userLabel.getName())
                                    .setControlType(CardService.SwitchControlType.CHECK_BOX)
                                    .setSelected(data.isLabelSelected(userLabel))
                            )
                    ),
                CardService.newCardSection().setHeader('Labels')
            )
        )
        .build();

    return [exampleCard, contextualLabelerCard];
}
