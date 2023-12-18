import chalk from 'chalk'
import axios from 'axios'
import {render} from '../src/render'
const gist = 'https://gist.githubusercontent.com/YOYZHANG/95b887fffe3854aed019b0797e8be605/raw/abd07b6e922ce70b58cb746e36409340d5fe200f/resume.json'
async function buildResumeHTML() {
  chalk.bgBlue('downloading resume from gist')
  const {data} = await axios.get(gist)

  let resume = {}
  try {
    resume = JSON.parse(data)
  } catch(e) {}

  chalk.bgBlue('rendering resume')
  const html = (await import('../src/render')).render(resume);

}
