// data/itemsNavbar.ts
import { Home, User, Briefcase, Mail, BookOpen } from "lucide-react";

export const itemsNavbar = [
  {
    id: 1,
    title: "Inicio",
    icon: <Home size={25} />,
    link: "/",
  },
  {
    id: 2,
    title: "Sobre mí",
    icon: <User size={25} />,
    link: "/about",
  },
  {
    id: 3,
    title: "Proyectos",
    icon: <Briefcase size={25} />,
    link: "/projects",
  },
  {
    id: 4,
    title: "Newsletter",
    icon: <BookOpen size={25} />,
    link: "/newsletter",
  },
  {
    id: 5,
    title: "Contacto",
    icon: <Mail size={25} />,
    link: "/contact",
  },
];