interface SwitchLabelForThreadProps {
    action: 'remove' | 'add';
    threadId: string;
    labelName: string;
}

function isSwitchLabelForThreadProps(x: any): x is SwitchLabelForThreadProps {
    if (typeof x !== 'object' || x === null) {
        return false;
    }
    if (typeof x['labelName'] !== 'string') {
        return false;
    }
    if (typeof x['threadId'] !== 'string') {
        return false;
    }
    if (!('action' in x && (x['action'] === 'remove' || x['action'] === 'add'))) {
        return false;
    }
    return true;
}

function onSwitchLabelForThread(e: GoogleAppsScript.Addons.EventObject): GoogleAppsScript.Card_Service.ActionResponse {
    // Activate temporary Gmail scopes, in this case to allow message metadata to be read.
    const accessToken = e.gmail.accessToken;
    GmailApp.setCurrentMessageAccessToken(accessToken);

    if (!isSwitchLabelForThreadProps(e.commonEventObject.parameters)) {
        console.error('Invalid parameters', e.commonEventObject.parameters);
        return;
    }

    const { action, threadId, labelName } = e.commonEventObject.parameters;
    const thread = GmailApp.getThreadById(threadId);
    const label = GmailApp.getUserLabelByName(labelName);

    if (!thread) {
        console.error('Thread not found', threadId);
        return;
    }

    if (action === 'add') {
        console.log(`Add label "${labelName}" to thread "${threadId}".`);
        thread.addLabel(label);
    }

    if (action === 'remove') {
        console.log(`Remove label "${labelName}" from thread "${threadId}".`);
        thread.removeLabel(label);
    }

    const userLabels = GmailApp.getUserLabels();
    const labelsInThread = thread.getLabels();
    const labelModel = getLabelModel(userLabels, labelsInThread);
    const contextualLabelerCard = buildContextualLabelerCard(labelModel, thread.getId());

    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().popToRoot().updateCard(contextualLabelerCard))
        .build();
}
