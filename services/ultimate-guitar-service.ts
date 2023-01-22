import axios from 'axios'
import { JSDOM } from 'jsdom'

const getPage = async (url: string): Promise<string | undefined> => {
  return (await axios.get(url)).data
}

const getDocument = async (url: string): Promise<Document> => {
  const page = await getPage(url)
  const dom = new JSDOM(page)
  return dom.window.document;
}

const parseChords = (contentRaw: string): string[][] => {
  const contentLines = contentRaw.split('\r\n').map(line => line.replace(/\s+/g, ''))
  const chords: string[][] = []
  contentLines.forEach(line => {
    const matched = line.match((/(?<=\[ch\]).+?(?=\[\/ch\])/g))
    matched && chords.push(matched!)
  })
  return chords
}

export default async function extractChords(url: string): Promise<string[][]> {
  const document = await getDocument(url)
  const storeDiv = document.querySelector('.js-store')
  const dataContent = storeDiv?.getAttribute('data-content')
  const contentRaw = JSON.parse(dataContent!).store.page.data.tab_view.wiki_tab.content
  return parseChords(contentRaw)
}

const test_url = 'https://tabs.ultimate-guitar.com/tab/bruce-springsteen/streets-of-philadelphia-chords-84466'
extractChords(test_url).then(chords => { console.log(chords) })