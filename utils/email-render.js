import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const renderTemplate = (templateName, data) => {
    const filePath = path.join(
        process.cwd(),
        'templates',
        `${templateName}.hbs`
    );

    const source = fs.readFileSync(filePath, 'utf-8');
    const template = Handlebars.compile(source);

    return template(data);
};
