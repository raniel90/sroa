import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const filePath = path.join(__dirname, 'swagger.yaml');
const file = fs.readFileSync(filePath, 'utf8');

export const swaggerDocument = yaml.parse(file);