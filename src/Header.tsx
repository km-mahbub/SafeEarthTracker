import React from "react";
import Navbar from "./components/NavBar";

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = () => {
  return (
    <header>
      <Navbar />
    </header>
  );
};
