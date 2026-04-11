import getNextVersion from "@/actions/system/get-next-version";
import Link from "next/link";
import { version } from "@/package.json";
import { footerBadgeLabels, footerLinks, footerMeta } from "./footer-links";

const Footer = async () => {
  const nextVersion = await getNextVersion();

  return (
    <footer className="flex flex-row h-8 justify-end items-center w-full text-xs text-muted-foreground p-5">
      <div className="hidden md:flex pr-5">
        <Link href="/">
          <h1 className="text-muted-foreground hover:text-foreground transition-colors">
            {process.env.NEXT_PUBLIC_APP_NAME} - v{version}
          </h1>
        </Link>
      </div>
      <div className="hidden md:flex space-x-2 pr-2">
        {footerMeta.poweredBy}
        <span className="bg-black dark:bg-white rounded-md text-white dark:text-black px-1 mx-1">
          {footerBadgeLabels.nextjs ?? nextVersion.substring(1, 7) || process.env.NEXT_PUBLIC_NEXT_VERSION}
        </span>
        +
        <Link href={footerLinks[0].href}>
          <span className="rounded-md mr-2 hover:text-foreground transition-colors">
            {footerLinks[0].label}
          </span>
        </Link>
        {footerMeta.hostedBy}
        <span className="text-bold underline hover:text-foreground transition-colors">
          <Link href={footerLinks[1].href}>{footerLinks[1].label}</Link>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
