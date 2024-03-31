import handlebars from 'handlebars'
import fs from 'fs-extra'
import {fileURLToPath} from 'url';
import {resolve, dirname} from 'path';
import moment from 'moment';

const __filename = fileURLToPath(import.meta.url);
const __dirname = resolve(dirname(__filename), '../');

export function render(resume: Record<string, unknown>): string {
  const template = fs.readFileSync(__dirname +'/resume.hbs', 'utf8')
  const css = fs.readFileSync(__dirname + '/assets/theme.css', 'utf-8')

  handlebars.registerHelper('toSocialIcon', function (text) {
    switch(text){
      case 'GitHub':
        return 'ri:github-fill';
      case 'LinkedIn':
        return 'ri:linkedin-fill';
      case 'Twitter':
        return 'ri:twitter-fill';
      case 'maston':
        return 'ri:mastodon-fill';
      case 'link':
          return 'ri:article-line';
      default:
        return '';
    }
  })

  handlebars.registerHelper('join', function (arr) {
    return arr.join(', ')
  })

  handlebars.registerHelper('getGithubApi', () => {})

  handlebars.registerHelper('breaklines', function(text) {
    text = text.replace(/(\n\r)/g, '<br>')
    return new handlebars.SafeString(text)
  })

  handlebars.registerHelper('getBuildDate', function(date) {
    if (!date) {
      return
    }

    return moment(new Date(date)).format('MMM YYYY')
  
  })

  return handlebars.compile(template)({
    resume: resume,
    css: css
  });
}

