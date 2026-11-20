// Vite's library mode writes the CSS to its own file and does not import it
// from the JS. Add that import, so importing the package loads its styles.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

const js = 'dist/index.js';
const css = 'dist/bob.css';
if (!existsSync(css)) throw new Error(`${css} is missing: the build wrote no stylesheet`);
const src = readFileSync(js, 'utf8');
const line = "import './bob.css';\n";
if (!src.startsWith(line)) writeFileSync(js, line + src);
