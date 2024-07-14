import { HeartIcon } from "@heroicons/react/16/solid";
import navigation from "./ProtectedLayout/navigation";
import Link from "next/link";

export default function Footer({ links }: { links?: boolean }) {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl overflow-hidden px-6 py-8 sm:py-16 lg:px-8">
        {links && (
          <nav
            className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
            aria-label="Footer"
          >
            {navigation.map(item => (
              <div key={item.name} className="pb-6">
                <Link
                  href={item.href}
                  className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                >
                  {item.name}
                </Link>
              </div>
            ))}
          </nav>
        )}
        <p className="mt-10 text-center text-xs leading-5 text-gray-500 space-y-2">
          Made with <HeartIcon className="h-4 inline" /> by&nbsp;
          <a href="https://dylanbulmer.com" target="_BLANK">
            Dylan Bulmer
          </a>
        </p>
        <p className="mb-10 text-center text-xs leading-5 text-gray-500 space-y-2">
          Powered by&nbsp;
          <a href="https://ory.sh" target="_BLANK">
            Ory
          </a>
        </p>
      </div>
    </footer>
  );
}
