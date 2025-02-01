const generateMatches = async (participants) => {
    const matches = [];
    let id = 1;
    let temp = 1;
    const highPow = 2 ** Math.ceil(Math.log2(participants.length));
    const lowPow = 2 ** Math.floor(Math.log2(participants.length));
    const bye = participants.length - lowPow;
    let curr = 0;
    let x = 0;

    if (bye > 0) {
        curr += highPow / 2;
        for (let i = 0; i < highPow / 2; i++) {
            matches.push({
                id,
                tournamentRoundText: 0,
                nextMatchId: curr + temp,
                participants: [
                    x < 2 * bye
                        ? participants[x++]
                        : { name: 'NA' },
                    x < 2 * bye
                        ? participants[x++]
                        : { name: 'NA' }
                ]
            });
            if (id % 2 === 0) temp++;
            id++;
        }
    }

    curr += lowPow / 2;
    temp = 1;
    for (let i = 0; i < lowPow; i += 2) {
        if (i + 1 < bye) {
            matches.push({
                id,
                tournamentRoundText: 1,
                nextMatchId: curr + temp,
                participants: []
            });
        } else {
            matches.push({
                id,
                tournamentRoundText: 1,
                nextMatchId: curr + temp,
                participants: [
                    i < bye
                        ? (participants[x++])
                        : { name: 'TBD' },
                    i + 1 < bye
                        ? (participants[x++])
                        : { name: 'TBD' }
                ]
            });
        }
        if (id % 2 === 0) temp++;
        id++;
    }

    for (let r = 2; r <= Math.log2(lowPow); r++) {
        curr += lowPow / (1 << r);
        let temp = 1;
        for (let i = 0; i < lowPow; i += 1 << r) {
            matches.push({
                id,
                tournamentRoundText: r,
                nextMatchId: curr + temp,
                participants: [] 
            });
            if (id % 2 === 0) temp++;
            id++;
        }
    }

    matches[matches.length - 1].nextMatchId = null;

    return matches;
};
