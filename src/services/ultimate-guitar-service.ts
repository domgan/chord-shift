import { JSDOM } from 'jsdom'

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Cache-Control': 'max-age=0',
  Connection: 'keep-alive',
  'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"macOS"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1',
  Referer: 'https://www.google.com/',
  DNT: '1',
}

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url, {
    method: 'GET',
    headers: BROWSER_HEADERS,
    redirect: 'follow',
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }

  return response.text()
}

export function parseChords(contentRaw: string): string[][] {
  // Handle both \r\n and \n line endings
  const contentLines = contentRaw
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+/g, ''))

  const chords: string[][] = []

  for (const line of contentLines) {
    const matched = line.match(/(?<=\[ch\]).+?(?=\[\/ch\])/g)
    if (matched && matched.length > 0) {
      chords.push(matched)
    }
  }

  return chords
}

export async function extractChords(url: string): Promise<string[][]> {
  const html = await fetchPage(url)
  const dom = new JSDOM(html)
  const document = dom.window.document

  const storeDiv = document.querySelector('.js-store')
  if (!storeDiv) {
    throw new Error('Could not find chord data on page - site structure may have changed')
  }

  const dataContent = storeDiv.getAttribute('data-content')
  if (!dataContent) {
    throw new Error('No data-content attribute found')
  }

  const parsed = JSON.parse(dataContent)
  const contentRaw = parsed?.store?.page?.data?.tab_view?.wiki_tab?.content

  if (!contentRaw) {
    throw new Error('Could not extract chord content from page data')
  }

  return parseChords(contentRaw)
}
