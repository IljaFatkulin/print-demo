import { MdCastConnected } from "react-icons/md";
import { AiOutlineProduct } from "react-icons/ai";
import cn from "classnames";
import { NavLink } from "react-router-dom";

const navLinks = [
  {
    name: "Products",
    icon: AiOutlineProduct,
    to: "/",
  },
  {
    name: "Connect",
    icon: MdCastConnected,
    to: "/connect",
  },
];

export default function Navigation() {
  return (
    <div className="fixed bottom-0 w-full flex justify-around items-center h-16 bg-white">
      {navLinks.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            to={link.to}
            key={link.name}
            className={({ isActive }) =>
              cn("p-2", {
                "bg-slate-300 rounded-xl": isActive,
              })
            }
          >
            <Icon size={40} />
          </NavLink>
        );
      })}
    </div>
  );
}
