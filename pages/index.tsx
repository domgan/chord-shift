import Head from 'next/head'
import { Inter } from '@next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>CHORD SHIFT</title>
        <meta name="description" content="chord-shift WIP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='main'>
        <div className='px-6 pt-4 pb-2'>
          <Link
            href='/chords'
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75'
          >
            <h2 className={inter.className}>
              Chords <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Start to build your chord progressions!
            </p>
          </Link>
          <a
            href="https://jazz-library.com/articles/chord-symbols/"
            className='inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 bg-sky-500/75'
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className={inter.className}>
              Learn <span>-&gt;</span>
            </h2>
            <p className={inter.className}>
              Learn about chord symbols.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
