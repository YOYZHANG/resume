import http from 'http'
import fs from 'fs-extra'
import {fileURLToPath} from 'url';
import {resolve, dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(dirname(__filename), '../');

async function renderScheme() {
  try {
    const schema = fs.readFileSync(__dirname + '/sample.resume.json', 'utf8')
    return (await import('../src/index.ts')).render(JSON.parse(schema))
  }
  catch(e) {
    console.error(e)
    return '<h1>Error</h1>'
  }
}

const port = 8081
const server = http.createServer(async (req, res) => {
  if (req.url === '/'){
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(await renderScheme());
  }
})

server.listen(port)

console.log(`Server running at http://localhost:${port}`)
