import { Bell, Menu } from "lucide-react";

 export default function AdminNavBar(){
    return(
      <>
      <nav className="bg-white px-6 py-4 shadow-lg flex items-center justify-between">
    <div className="flex items-center gap-3">
    <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
      <Menu size={28} />
    </button>
    <h2 className="text-2xl font-bold">Dashboard</h2>
  </div>
  
  <div className="flex items-center gap-4">
    <Bell size={24} className="cursor-pointer" />
    <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
      <span className="text-sm font-bold">MK</span>
    </div>
  </div>
  </nav></>
    )
  }