import React from "react";
import Logout from "./auth/Logout";

const Navbar = () => {
  return(
    <div className="flex justify-between bg-blue-400 p-5 text-white">
      <p className="font-bold text-lg">Mern TODO</p>
      <Logout />
    </div>
  )
}

export default Navbar;