import chalk from 'chalk'
import axios from 'axios'
import fs from 'fs-extra';
import puppeter from 'puppeteer'
import {fileURLToPath} from 'url';
import {resolve, dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(dirname(__filename), '../');

const gist = 'https://gist.githubusercontent.com/YOYZHANG/95b887fffe3854aed019b0797e8be605/raw/resume.json'
async function buildResumeHTML(): Promise<string> {
  await fs.remove(__dirname + '/dist')
  await fs.ensureDir(__dirname + '/dist')
  console.log(chalk.bgBlue('downloading resume from gist...'))
  
  const {data} = await axios.get(gist)
  const resume = data

  console.log(chalk.bgBlue('rendering resume...'))
  const html = (await import('../src/index.js')).render(resume)

  console.log(chalk.bgBlue('save resume to dist...'))
  fs.writeFileSync(__dirname + '/dist/resume.html', html, 'utf-8')

  console.log(chalk.bgBlue('done...'))

  return html
}

async function convertToPDF(html: string) {
  console.log(chalk.bgBlue('open puppeter...'))
  const browser = await puppeter.launch({
    headless: "new"
  })
  const page = await browser.newPage()
  await page.setContent(html, {waitUntil: 'networkidle0'})

  console.log(chalk.bgBlue('generting pdf...'))
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    displayHeaderFooter: false,
    margin: {
      top: '0.4in',
      bottom: '0.4in',
      left: '0.4in',
      right: '0.4in',
    }
  })

  console.log(chalk.bgBlue('save pdf to dist...'))

  fs.writeFileSync(__dirname + '/dist/resume.pdf', pdfBuffer)

  await browser.close()
}

async function build() {
  const html = await buildResumeHTML()
  await convertToPDF(html)
}


build().catch(e => {
  console.error(chalk.red(e))
  process.exit(1)
})
