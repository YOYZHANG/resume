import chalk from 'chalk'
import axios from 'axios'
import fs from 'fs-extra';
import puppeter from 'puppeteer'
import {fileURLToPath} from 'url';
import {resolve, dirname} from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(dirname(__filename), '../');

const enGist = 'https://gist.githubusercontent.com/YOYZHANG/95b887fffe3854aed019b0797e8be605/raw/resume-en.json'
const cnGist = 'https://gist.githubusercontent.com/YOYZHANG/2c156b90a775ea4c72bd66817962e379/raw/resume-cn.json'
async function buildResumeHTML(gist: string, output: string, locale: string | undefined): Promise<string> {
  await fs.remove(__dirname + '/dist')
  await fs.ensureDir(__dirname + '/dist')
  console.log(chalk.bgBlue('downloading resume from gist...'))
  
  const {data} = await axios.get(gist)
  const resume = data

  console.log(chalk.bgBlue('rendering resume...'))
  const html = (await import('../src/index.js')).render(resume, locale)

  console.log(chalk.bgBlue('save resume to dist...'))
  fs.writeFileSync(__dirname + `/dist/${output}.html`, html, 'utf-8')

  console.log(chalk.bgBlue('done...'))

  return html
}

async function convertToPDF(html: string, output: string) {
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

  fs.writeFileSync(__dirname + `/dist/${output}.pdf`, pdfBuffer)

  await browser.close()
}

async function build(gist: string, output: string, locale?: string) {
  const html = await buildResumeHTML(gist, output, locale)
  await convertToPDF(html, output)
}


build(enGist, 'resume').catch(e => {
  console.error(chalk.red(e))
  process.exit(1)
})

build(cnGist, 'resume-cn', 'cn').catch(e => {
  console.error(chalk.red(e))
  process.exit(1)
})
