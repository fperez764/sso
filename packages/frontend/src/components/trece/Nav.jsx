"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuthState } from "@src/context/auth";
import Avatar from "../Avatar";

const Nav = () => {
  const { user } =  useAuthState();
  const [toggleDropdown, setToggleDropdown] = useState(false);

  return (
    <nav className='w-full pt-3 mb-16 flex-between'>
      <Link href='/' className='flex gap-2 flex-center'>
        <Image
          src='/@public/images/ABE.ico'
          alt='logo'
          width='30'
          height='auto'
          className='object-contain'
        />
        <p className='logo_text'>SSO: Tickets</p>
      </Link>

      {/* Desktop Navigation */}
      <div className='hidden sm:flex'>
        {user ? (
          <div className='flex gap-3 md:gap-5'>
            <Link href='/create-prompt' className='black_btn'>
              Create Post
            </Link>

            <button type='button' onClick={signOut} className='outline_btn'>
              Sign Out
            </button>

            <Link href='/profile'>
              <Image
                src={`${user.area}.png`}
                width={37}
                height={37}
                className='rounded-full'
                alt='area'
              />
            </Link>
          </div>
        ) : (
          <Avatar />
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='relative flex sm:hidden'>
        {user ? (
          <div className='flex'>
            <Image
              src={`${user.departamento}.png`}
              width={37}
              height={37}
              className='rounded-full'
              alt='Departamento'
              onClick={() => setToggleDropdown(!toggleDropdown)}
            />

            {toggleDropdown && (
              <div className='dropdown'>
                <Link
                  href='/profile'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  My Profile
                </Link>
                <Link
                  href='/create-prompt'
                  className='dropdown_link'
                  onClick={() => setToggleDropdown(false)}
                >
                  Create Prompt
                </Link>
                <Avatar />
              </div>
            )}
          </div>
        ) : (
          <Avatar />
        )}
      </div>
    </nav>
  );
};

export default Nav;
