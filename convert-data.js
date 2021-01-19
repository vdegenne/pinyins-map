JSON.stringify(Object.values($0.___hanjas).map(h => {
    const o = {
        p: h.pinyin,
        t: h.symbol
    };
    if (h.simplified) {
        o.s = h.simplified
    }
    return o;
}))