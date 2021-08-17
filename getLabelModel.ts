interface ChildLabel {
    name: string;
    selected: boolean;
    fullName: string;
}

interface RootLabel {
    name: string;
    selected: boolean;
    childLabels: Map<string, ChildLabel>;
}

interface LabelModel {
    rootLabels: Map<string, RootLabel>;
}

function getLabelModel(
    userLabels: GoogleAppsScript.Gmail.GmailLabel[],
    labelsInThread: GoogleAppsScript.Gmail.GmailLabel[]
): LabelModel {
    const labelMapOfThread = labelsInThread.reduce(
        (map, label) => map.set(label.getName(), label),
        new Map<string, GoogleAppsScript.Gmail.GmailLabel>()
    );
    /**
     * Returns true if the label is selected in the thread.
     * @param labelName
     * @returns
     */
    const isLabelSelected = (labelName: string): boolean => {
        return labelMapOfThread.has(labelName);
    };
    /**
     * Creates an entry in the label model for the root label if not created already.
     * @param labelModel
     * @param labelName
     * @returns
     */
    const ensureRootLabel = (labelModel: LabelModel, labelName: string): void => {
        if (labelModel.rootLabels.has(labelName)) {
            return;
        }
        labelModel.rootLabels.set(labelName, {
            name: labelName,
            selected: false,
            childLabels: new Map<string, ChildLabel>(),
        });
    };
    const labelModel = userLabels.reduce(
        (model, userLabel) => {
            const labelInfo = parseLabelName(userLabel);
            if (labelInfo.isRoot === true) {
                ensureRootLabel(model, labelInfo.name);

                const rootLabel = model.rootLabels.get(labelInfo.name);
                rootLabel.selected = isLabelSelected(labelInfo.fullName);
            } else {
                ensureRootLabel(model, labelInfo.rootName);

                const selected = isLabelSelected(labelInfo.fullName);
                const rootLabel = model.rootLabels.get(labelInfo.rootName);

                // Mark root as selected if any of the children is selected.
                if (selected === true) {
                    rootLabel.selected = true;
                }

                rootLabel.childLabels.set(labelInfo.name, {
                    name: labelInfo.name,
                    selected,
                    fullName: labelInfo.fullName,
                });
            }

            return model;
        },
        { rootLabels: new Map<string, RootLabel>() } as LabelModel
    );

    return labelModel;
}
