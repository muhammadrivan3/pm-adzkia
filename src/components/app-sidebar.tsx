"use client";
import {
  Home,
  Users,
  GraduationCap,
  FileBarChart,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { motion } from "framer-motion";
// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "User", // Banyak user
    url: "/user",
    icon: Users,
  },
  {
    title: "Dosen", // Mirip 'Guru/Pendidikan'
    url: "/dosen",
    icon: GraduationCap,
  },
  {
    title: "Penilaian", // Statistik atau laporan
    url: "/penilaian",
    icon: FileBarChart,
  },
  {
    title: "Aspek",
    url: "/aspek",
    icon: Settings,
  },
  {
    title: "Log Acticity",
    url: "/log-activity",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="shadow-2xl">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex justify-center items-center">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Image
                src="/img/adzkia.png"
                height={150}
                width={150}
                alt="logo"
              />
            </motion.div>
          </div>

          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="p-2">
              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="w-full"
                  >
                    <SidebarMenuButton
                      asChild
                      className="transition-all hover:text-sidebar-accent-foreground"
                    >
                      <a
                        href={item.url}
                        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-sidebar-accent transition-colors"
                        aria-label={item.title}
                      >
                        <item.icon
                          size={22}
                          className="transition-transform group-hover:scale-110"
                        />
                        <span className=" text-md">
                          {item.title}
                        </span>
                      </a>
                    </SidebarMenuButton>
                  </motion.div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
