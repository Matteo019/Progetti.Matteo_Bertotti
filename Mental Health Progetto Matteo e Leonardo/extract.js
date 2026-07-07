const fs = require('fs');
const path = require('path');

const sitoDir = path.resolve('../Sito.matteo.AI');
const imagesDir = path.join(sitoDir, 'images', 'notebook');
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

const nb = JSON.parse(fs.readFileSync('Analisi_mentalHealth&work.ipynb', 'utf8'));

const steps = [];
let currentStep = null;
let imgCounter = 1;

for (let i=0; i<nb.cells.length; i++) {
    const cell = nb.cells[i];
    
    if (cell.cell_type === 'markdown') {
        const text = (cell.source || []).join('');
        
        // Se abbiamo già del codice, questo markdown appartiene al PROSSIMO step!
        if (currentStep && currentStep.code !== '') {
            steps.push(currentStep);
            currentStep = null;
        }
        
        if (!currentStep) {
            currentStep = { title_it: 'Step ' + (steps.length + 1), title_en: 'Step ' + (steps.length + 1), description_it: text, description_en: text, code: '', outputType: 'html', outputContent: '' };
        } else {
            currentStep.description_it += '\n\n' + text;
            currentStep.description_en += '\n\n' + text;
        }
    } else if (cell.cell_type === 'code') {
        if (!currentStep) {
            currentStep = { title_it: 'Step ' + (steps.length + 1), title_en: 'Step ' + (steps.length + 1), description_it: '', description_en: '', code: '', outputType: 'html', outputContent: '' };
        }
        
        // Se abbiamo già del codice nello step corrente, passiamo al prossimo
        if (currentStep.code !== '') {
            steps.push(currentStep);
            currentStep = { title_it: 'Step ' + (steps.length + 1), title_en: 'Step ' + (steps.length + 1), description_it: '', description_en: '', code: '', outputType: 'html', outputContent: '' };
        }
        
        currentStep.code = (cell.source || []).join('');
        
        if (cell.outputs) {
            for (const out of cell.outputs) {
                if (out.data && out.data['image/png']) {
                    const b64 = out.data['image/png'].replace(/\n/g, '');
                    const imgName = 'nb_chart_' + imgCounter + '.png';
                    fs.writeFileSync(path.join(imagesDir, imgName), b64, 'base64');
                    currentStep.outputContent += '<img src="images/notebook/' + imgName + '" alt="Chart" style="max-width:100%; border-radius:8px; margin-bottom:1rem;">\n';
                    imgCounter++;
                } else if (out.text) {
                    const rawText = (out.text || []).join('').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    currentStep.outputContent += '<pre style="margin:0; font-family:var(--font-mono); font-size:0.8rem; color:var(--text);">' + rawText + '</pre>\n';
                }
            }
        }
    }
}
if (currentStep) steps.push(currentStep);

const finalData = {
    title_it: 'Analisi Mental Health & Lavoro',
    title_en: 'Mental Health & Work Analysis',
    steps: steps
};

fs.writeFileSync('../Sito.matteo.AI/notebook-steps.json', JSON.stringify(finalData, null, 2));
console.log('Extracted ' + steps.length + ' steps and ' + (imgCounter - 1) + ' images. Saved directly to notebook-steps.json');
