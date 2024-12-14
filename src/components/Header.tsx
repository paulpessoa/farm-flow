'use client'
import { useState } from 'react'
import CreateFarmForm from './CreateFarmForm'
import { Leaf } from "lucide-react";
import GenericModal from './GenericModal';


const Header: React.FC = () => {
  const [newFarm, setNewFarm] = useState<boolean>(false)
  return (
    <header className="bg-indigo-950">
      <nav aria-label="Global" className="mx-auto flex container items-center justify-between p-6">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Farm Flow</span>
            <img
              alt=""
              src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
              className="h-8 w-auto"
            />
          </a>
        </div>

        <button
          onClick={() => setNewFarm(true)}
          className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-950 bg-orange-400 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
        >
          <Leaf className="mr-2 h-4 w-4" />
          New Farm
        </button>


      </nav>
      <GenericModal onClose={() => setNewFarm(false)} isOpen={newFarm}>
        <CreateFarmForm />
      </GenericModal>
    </header>
  )
}

export default Header
