function sortRootLabels(labelA: RootLabel, labelB: RootLabel): number {
    if (labelA.name === labelB.name) {
        return 0;
    }

    return labelA.name < labelB.name ? -1 : 1;
}
