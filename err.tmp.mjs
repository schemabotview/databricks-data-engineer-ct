import puppeteer from 'puppeteer'
const b = await puppeteer.launch({ headless: true, executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] })
const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 })
p.on('pageerror', e => console.log('ERR', e.message)); p.on('console', m => m.type()==='error' && console.log('CONSOLE', m.text()))
await p.goto('http://localhost:5199/?capture=1#/' + process.argv[2], { waitUntil: 'networkidle0' })
await new Promise(r => setTimeout(r, 1500))
console.log(await p.evaluate(() => document.querySelectorAll('.flow-node').length))
await p.screenshot({ path: '/tmp/claude-0/one.png' }); await b.close()
