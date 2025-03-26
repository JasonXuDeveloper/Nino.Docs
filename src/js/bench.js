export function getBench(table) {
    // Custom logic for extracting data from the table
    const benchData = {
        msgpack: [],
        memorypack: [],
        nino: []
    };

    const rows = table.querySelectorAll('tbody tr');
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');

        if (cells.length > 1) {
            const methodName = cells[0].textContent.trim();
            const val = parseFloat(cells[4].textContent.replace(/,/g, '').replace(' ns', ''));
            //log scale
            const logVal = Math.log10(val);

            if (methodName.includes('MessagePack')) {
                benchData.msgpack.push(logVal);
            } else if (methodName.includes('MemoryPack')) {
                benchData.memorypack.push(logVal);
            } else if (methodName.includes('Nino')) {
                benchData.nino.push(logVal);
            }
        }
    });

    // normalize the data, per benchmark, across [msgpack, memorypack, nino], per index
    for (let i = 0; i < benchData.msgpack.length; i++) {
        const max = Math.max(benchData.msgpack[i], benchData.memorypack[i], benchData.nino[i]);
        benchData.msgpack[i] = benchData.msgpack[i] / max;
        benchData.memorypack[i] = benchData.memorypack[i] / max;
        benchData.nino[i] = benchData.nino[i] / max;
    }


    return benchData;
}

export function getDataset(bench, s, d) {
    return [
        {
            label: 'MessagePack',
            backgroundColor: '#f87979',
            data: [bench["msgpack"][s], bench["msgpack"][d]]
        },
        {
            label: 'MemoryPack',
            backgroundColor: '#7f79f8',
            data: [bench["memorypack"][s], bench["memorypack"][d]]
        },
        {
            label: 'Nino',
            backgroundColor: '#79f8b4',
            data: [bench["nino"][s], bench["nino"][d]]
        }
    ]
}