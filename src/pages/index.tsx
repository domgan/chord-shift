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
      <main className='main p-16'>
        <div className='px-6 pt-4 pb-2 mx-auto text-center transform scale-150'>
          <Link
            href='/chords'
            className='inline-block rounded-full shadow-md px-3 py-1 text-sm text-white mr-2 mb-2 bg-indigo-500 hover:bg-indigo-600 border border-gray-400 hover:shadow-md hover:border-sky-600'
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
            className='inline-block rounded-full shadow-md px-3 py-1 text-sm text-white mr-2 mb-2 bg-indigo-500 hover:bg-indigo-600 border border-gray-400 hover:shadow-md hover:border-sky-600'
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
