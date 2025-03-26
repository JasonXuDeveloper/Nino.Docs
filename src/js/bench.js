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
            var val = parseFloat(cells[1].textContent.replace(/,/g, '').replace(' ns', ''));
            //log scale
            val = Math.log2(val);

            if (methodName.includes('MessagePack')) {
                benchData.msgpack.push(val);
            } else if (methodName.includes('MemoryPack')) {
                benchData.memorypack.push(val);
            } else if (methodName.includes('Nino')) {
                benchData.nino.push(val);
            }
        }
    });

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