const fs = require('fs');
const nb = JSON.parse(fs.readFileSync('Analisi_mentalHealth&work.ipynb', 'utf8'));
nb.cells.forEach((cell, i) => {
    const source = (cell.source || []).join('').substring(0, 80).replace(/\n/g, ' ');
    let hasImage = false;
    if (cell.outputs) {
        hasImage = cell.outputs.some(out => out.data && out.data['image/png']);
    }
    console.log('Cell ' + i + ' (' + cell.cell_type + ') [Image: ' + hasImage + ']: ' + source);
});

