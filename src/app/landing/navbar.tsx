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
import { UserButton, useUser } from "@civic/auth/react";
import { useRouter } from "next/navigation";

export default function LandingNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);  const { user, isLoading } = useUser();
  const router = useRouter();

  // Debug user state
  useEffect(() => {
    console.log('Navbar - User state:', { user: !!user, isLoading, email: user?.email });
  }, [user, isLoading]);

  // smooth scroll
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
  ];  const handleGetStarted = () => {
    router.push('/auth/login');
  };

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
          />          {/* User avatar/Get Started section on right */}
          <div className="flex items-center gap-4">
            <motion.div
              className="hidden md:flex items-center relative z-[100]"
              animate={{ scale: visible ? 0.85 : 1 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {user && !isLoading ? (
                <UserButton />
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </button>
              )}
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
            ))}            {/* Mobile user section */}
            <div className="mt-4 border-t border-neutral-200 dark:border-neutral-700 pt-4 flex justify-start">
              {user && !isLoading ? (
                <UserButton />
              ) : (
                <button
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Get Started'}
                </button>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
