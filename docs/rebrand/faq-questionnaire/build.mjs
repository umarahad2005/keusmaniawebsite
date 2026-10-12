/* Builds the FAQ questionnaire for the owner/client:
     node docs/rebrand/faq-questionnaire/build.mjs
   → questionnaire.html (in this folder), then printed to PDF with headless
   Chrome as docs/rebrand/KEUI-FAQ-Questionnaire.pdf.
   Part A lists the FAQ answers currently on the website (from src/data.js) to
   confirm or correct; Part B asks new questions pilgrims commonly ask. */
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { execFileSync } from 'node:child_process'

const HERE = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(HERE, '..', '..', '..')
const SITE_DIR = path.join(ROOT, 'keu-website')
const { SITE } = await import(pathToFileURL(path.join(SITE_DIR, 'src', 'data.js')).href)
const fontUrl = f => pathToFileURL(path.join(SITE_DIR, 'public', 'fonts', f)).href
const markUrl = pathToFileURL(path.join(SITE_DIR, 'src', 'assets', 'brand', 'ku-mark.svg')).href

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const SECTIONS = [
  ['Booking and payment', [
    'How far in advance should pilgrims book a regular Umrah? And for Ramadan?',
    'What deposit confirms a booking, and when is the rest of the payment due?',
    'Which payment methods do you accept (bank transfer, cash at the office, card, others)?',
    'Can families pay in instalments? If yes, on what terms?',
    'What is your cancellation and refund policy?',
    'Can travel dates or traveller names be changed after booking? Is there a fee?',
  ]],
  ['Visa and documents', [
    'Which documents must a pilgrim provide (passport validity, CNIC, photographs, anything else)?',
    'Is the Umrah visa included in every package?',
    'Can you arrange Umrah for pilgrims living outside Pakistan (for example the UAE or the UK)?',
    'What is your current practice for women travelling without a mahram?',
    'Which vaccinations or health certificates are required?',
  ]],
  ['Flights and travel', [
    'Which cities can pilgrims fly from (Lahore only, or Islamabad and Karachi too)? Which airlines do you usually use?',
    'Do you offer packages without an air ticket? What is included then?',
    'What is the baggage allowance? Can pilgrims bring Zamzam water home?',
    'Are airport transfers in Saudi Arabia included?',
  ]],
  ['Hotels and stay', [
    'How far are your hotels from the Haram in Makkah and Madinah for each package tier?',
    'Are meals included? Which ones (breakfast, half board, full board)?',
    'What room sharing options are there (double, triple, quad), and how does the price change?',
    'Can pilgrims upgrade their hotel after choosing a package?',
  ]],
  ['On the journey', [
    'Does someone from your team travel with the group? Is the guide Urdu-speaking?',
    'Which ziyarah sites are visited in Makkah and Madinah, and are they included?',
    'How do pilgrims travel between Makkah and Madinah (bus, Haramain train, private car)?',
    'What food arrangements are there during the stay?',
    'Is there a 24/7 contact number for pilgrims while they are in Saudi Arabia?',
  ]],
  ['Families, elderly and special needs', [
    'What support do you give elderly pilgrims and wheelchair users?',
    'What is your policy for children and infants (age limits, prices)?',
    'Do you arrange women-only groups or have female staff on the journey?',
    'Is travel or health insurance included? What happens if a pilgrim falls ill?',
  ]],
  ['Seasons and Ramadan', [
    'When are Ramadan packages announced, and do you offer the last ten nights?',
    'Which months are calmer or lower priced for Umrah?',
  ]],
  ['Qafila e Shoq', [
    'How does someone apply for Qafila e Shoq, and who is it suitable for?',
    'How often does Qafila e Shoq travel, how many seats are there, and what does it cost?',
  ]],
  ['About the company', [
    'Which licences or registrations do you hold (for example the Ministry of Religious Affairs, DTS, IATA)? May we show the numbers on the website?',
    'Roughly how many pilgrims or groups do you take each year?',
    'In one or two sentences, what makes Karwan e Usmania International different?',
    'Do pilgrims need an appointment to visit the office?',
  ]],
]

let n = 0
const answerBox = (lines = 4) => `<div class="lines">${'<i></i>'.repeat(lines)}</div>`
const showTick = `<p class="tick"><span class="box"></span> Show this on the website <span class="sep"></span><span class="box"></span> Do not show</p>`

const partA = SITE.faqs.map(f => `
  <section class="q">
    <p class="qn">A${++n}</p>
    <div class="qb">
      <h3>${esc(f.q)}</h3>
      <p class="current"><span>On the website now:</span> ${esc(f.a)}</p>
      <p class="tick"><span class="box"></span> Correct as it is <span class="sep"></span><span class="box"></span> Change it to:</p>
      ${answerBox(3)}
    </div>
  </section>`).join('')

let m = 0
const partB = SECTIONS.map(([title, qs]) => `
  <h2 class="sec">${esc(title)}</h2>
  ${qs.map(q => `
  <section class="q">
    <p class="qn">B${++m}</p>
    <div class="qb">
      <h3>${esc(q)}</h3>
      ${answerBox(4)}
      ${showTick}
    </div>
  </section>`).join('')}`).join('')

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>FAQ questionnaire · Karwan e Usmania International</title>
<style>
  @font-face { font-family: 'Cormorant'; src: url('${fontUrl('cormorant-500-latin.woff2')}') format('woff2'); font-weight: 500; }
  @font-face { font-family: 'Manrope'; src: url('${fontUrl('manrope-var-latin.woff2')}') format('woff2'); font-weight: 200 800; }
  @page { size: A4; margin: 16mm 16mm 18mm; }
  :root { --green: #004828; --gold: #885800; --hair: #d9ae54; --ink: #1d2a24; --muted: #5f6f67; --paper: #fcfbf8; }
  * { box-sizing: border-box; }
  body { margin: 0; font: 10.5pt/1.5 'Manrope', Arial, sans-serif; color: var(--ink); }
  .cover { display: flex; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--hair); }
  .cover img { width: 54px; height: 54px; }
  .brand { font: 500 17pt/1.1 'Cormorant', Georgia, serif; letter-spacing: .04em; color: var(--green); text-transform: uppercase; }
  .brand small { display: block; font: 600 7.5pt/1.4 'Manrope', Arial; letter-spacing: .28em; color: var(--gold); }
  h1 { margin: 18px 0 6px; font: 500 26pt/1.05 'Cormorant', Georgia, serif; color: var(--green); }
  .lead { margin: 0 0 10px; color: var(--muted); max-width: 150mm; }
  .how { margin: 12px 0 4px; padding: 10px 12px; border: 1px solid var(--hair); background: var(--paper); font-size: 9.5pt; }
  .how b { color: var(--green); }
  .fields { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px 18px; margin: 14px 0 6px; font-size: 9pt; color: var(--muted); }
  .fields span { display: block; border-bottom: 1px solid #b9c2bc; height: 18px; }
  .part { margin: 22px 0 4px; font: 600 8pt/1.2 'Manrope', Arial; letter-spacing: .26em; text-transform: uppercase; color: var(--gold); display: flex; align-items: center; gap: 10px; }
  .part::before { content: ''; width: 40px; height: 1px; background: var(--hair); }
  .part-title { margin: 0 0 4px; font: 500 18pt/1.1 'Cormorant', Georgia, serif; color: var(--green); }
  .part-lead { margin: 0 0 6px; color: var(--muted); font-size: 9.5pt; }
  h2.sec { margin: 16px 0 2px; font: 500 14pt/1.2 'Cormorant', Georgia, serif; color: var(--green); border-bottom: 1px solid var(--hair); padding-bottom: 3px; break-after: avoid; }
  .q { display: grid; grid-template-columns: 30px 1fr; gap: 6px; padding: 10px 0 8px; border-bottom: 1px solid #e7e1d3; break-inside: avoid; }
  .qn { margin: 2px 0 0; font: 600 8.5pt/1.4 'Manrope', Arial; color: var(--gold); }
  h3 { margin: 0 0 6px; font: 600 10.5pt/1.4 'Manrope', Arial; color: var(--ink); }
  .current { margin: 0 0 6px; padding: 6px 8px; background: var(--paper); border-left: 2px solid var(--hair); font-size: 9pt; color: #3c4a43; }
  .current span { font-weight: 600; color: var(--green); }
  .lines i { display: block; height: 22px; border-bottom: 1px solid #c9cfcb; }
  .tick { margin: 7px 0 0; font-size: 8.5pt; color: var(--muted); display: flex; align-items: center; gap: 6px; }
  .box { width: 10px; height: 10px; border: 1px solid #7f8a84; display: inline-block; }
  .sep { width: 14px; }
  .other .lines i { height: 24px; }
  footer { position: fixed; bottom: -10mm; left: 0; right: 0; font-size: 7.5pt; color: var(--muted); display: flex; justify-content: space-between; }
</style></head>
<body>
  <footer><span>Karwan e Usmania International · Travel &amp; Tours · FAQ questionnaire</span><span>usmania.vercel.app</span></footer>
  <div class="cover">
    <img src="${markUrl}" alt="">
    <div class="brand">Karwan e Usmania<small>International · Travel &amp; Tours</small></div>
  </div>
  <h1>Website FAQ questionnaire</h1>
  <p class="lead">Your answers become the "Frequently Asked Questions" on the website. Please answer in your own words, in English or Urdu; we will write the final text and show it to you before it goes live.</p>
  <div class="how">
    <b>How to fill this in.</b> Part A shows the answers on the website today: tick "Correct" or write the change. Part B has new questions pilgrims often ask: answer the ones that apply, skip the rest, and tick whether each should appear on the website. Short answers are fine. If a fact may change (prices, dates), say so and we will keep it general.
  </div>
  <div class="fields">
    <div>Filled in by<span></span></div>
    <div>Date<span></span></div>
    <div>Phone / WhatsApp<span></span></div>
  </div>

  <p class="part">Part A</p>
  <h2 class="part-title">Answers on the website today</h2>
  <p class="part-lead">Please check each answer. Mark it correct, or write what it should say.</p>
  ${partA}

  <p class="part" style="break-before: page">Part B</p>
  <h2 class="part-title">New questions</h2>
  <p class="part-lead">Questions pilgrims commonly ask before booking. Answer the ones that apply to you.</p>
  ${partB}

  <h2 class="sec">Anything else</h2>
  <section class="q other">
    <p class="qn">C1</p>
    <div class="qb">
      <h3>Which other questions do your clients ask you most often? Please write each question and your answer.</h3>
      ${answerBox(10)}
    </div>
  </section>
</body></html>`

const htmlPath = path.join(HERE, 'questionnaire.html')
await fs.writeFile(htmlPath, html)
const pdfPath = path.join(ROOT, 'docs', 'rebrand', 'KEUI-FAQ-Questionnaire.pdf')
const chrome = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe'
execFileSync(chrome, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${pdfPath}`, '--allow-file-access-from-files', pathToFileURL(htmlPath).href], { stdio: 'inherit' })
console.log('PDF:', pdfPath, `(${SITE.faqs.length} current + ${m} new questions)`)
