function sortChildLabels(labelA: ChildLabel, labelB: ChildLabel): number {
    if (labelA.name === labelB.name) {
        return 0;
    }

    return labelA.name < labelB.name ? -1 : 1;
}
