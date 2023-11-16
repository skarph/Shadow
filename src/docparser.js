import path from 'path';
import fs from 'fs';

const file = fs.readFileSync(path.join(process.cwd(),'/app/data/doc.json'), 'utf8');
const data = JSON.parse(file);

const types = [];

for (const element of data) {
    if (element.type === 'type') {
        types.push(element);
    }
}

export function sanitizeLink(link) {
    // strip anything before /Kristal/ in the URL
    const index = link.indexOf('/Kristal/');
    return link.substring(index);
}

export const TYPES = types;