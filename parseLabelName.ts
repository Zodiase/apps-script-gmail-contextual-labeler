type LabelInfo = {
    fullName: string;
    name: string;
} & (
    | {
          isRoot: true;
      }
    | {
          isRoot: false;
          rootName: string;
      }
);

function parseLabelName(label: GoogleAppsScript.Gmail.GmailLabel): LabelInfo {
    const labelName = label.getName();
    const splits = labelName.split('/');

    if (splits.length <= 1) {
        return {
            fullName: labelName,
            name: labelName,
            isRoot: true,
        };
    } else {
        const [rootName, ...rests] = splits;

        return {
            fullName: labelName,
            name: rests.join('/'),
            isRoot: false,
            rootName,
        };
    }
}
