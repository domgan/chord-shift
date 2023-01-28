import { Dispatch, SetStateAction, useState } from "react";

type Props = {
  // setUltimateUrl: Dispatch<SetStateAction<string | undefined>>
  // setShowUltimateInput: Dispatch<SetStateAction<boolean>>
  loadFromUltimateGuitar: (ultimateUrl: string) => void
  setShowUltimateInput: Dispatch<SetStateAction<boolean>>
  // setShowUltimateInput: (show: boolean) => void
  // setUltimateUrl: (url: string) => void  // todo thats better probably
}

export default function UltimateInputModal(props: Props) {
  const [url, setUrl] = useState<string>()

  const handleSubmit = () => {
    props.loadFromUltimateGuitar(url!)
    props.setShowUltimateInput(false)
  }

  return (
    <div className="fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
      <div className="fixed inset-0 transition-opacity">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <form className="px-4 py-5 sm:p-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Chord
            </label>
            <input className="rounded-md shadow-sm block w-full leading-5 py-2 px-3 text-gray-900 border-gray-300 transition duration-150 ease-in-out"
              type="text" required onChange={(e) => setUrl(e.target.value)} />
          </div>
        </form>
        <div className="flex justify-between">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l" disabled={url === undefined} onClick={handleSubmit}>Submit</button>
          <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-r" onClick={() => props.setShowUltimateInput(false)}>Cancel</button>
        </div>
      </div>
    </div>
  )
}