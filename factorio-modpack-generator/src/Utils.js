export function parseTextFormat(text, colorStartWith='white') {
    
}

export function stringHasNaively(source, searchText) {
    const lower = source.toLowerCase();
    const specialWordRemoved = lower.replace(/[ .-]/g, '');

    return specialWordRemoved.indexOf(searchText) != -1;
}

export function setHasAny(source1, source2) {
    for (const ele of source1) {
        if (source2.has(ele)) {
            return true;
        }
    }
    return false;
}