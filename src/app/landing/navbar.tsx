// src/app/landing/LandingNavbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarLogo,
} from "@/components/ui/resizable-navbar";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { UserButton } from "@civic/auth/react";

export default function LandingNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 30);
  });

  const navItems = [
    { id: "features", name: "DOCS", link: "#docs" },
    { id: "pricing", name: "PRICING", link: "#pricing" },
    { id: "faqs", name: "TUTORIAL", link: "#" },
  ];

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setIsMobileOpen(false);
    }
  };

  return (
    <div className="w-full">
      <Navbar className="fixed inset-x-0 top-0 z-50 pt-2">
        <NavBody visible={visible}>
          <NavbarLogo />

          <NavItems
            className="font-['Poppins'] text-base "
            items={navItems.map((item) => ({
              name: item.name,
              link: item.link,
            }))}
            onItemClick={() => setIsMobileOpen(false)}
          />

          <div className="flex items-center gap-4">
            <motion.div
              className="hidden md:flex items-center relative z-[100]"
              animate={{ scale: visible ? 0.85 : 1 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="rounded-md transition-colors duration-200 hover:bg-transparent [&_*]:!text-black">
                <UserButton className="bg-[#E11D48] font-['Poppins']" />
              </div>
            </motion.div>
          </div>
        </NavBody>

        {/* Mobile Nav */}
        <MobileNav visible={visible}>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileOpen}
              onClick={() => setIsMobileOpen((o) => !o)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileOpen}
            onClose={() => setIsMobileOpen(false)}
          >
            {/* Mobile Links */}
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.link}
                onClick={() => handleScroll(item.link)}
                className="block px-4 py-2 text-white dark:text-white font-['Kagitingan']"
              >
                {item.name}
              </Link>
            ))}

            <div className="mt-4 border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-start">
              <div className="rounded-md transition-colors duration-200 hover:bg-red-600 [&_*]:!text-white">
                <UserButton className="bg-[#E11D48] font-['Poppins']" />
              </div>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
