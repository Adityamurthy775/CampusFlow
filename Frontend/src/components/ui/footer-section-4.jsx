import { motion } from "motion/react";
import { Globe, AtSign, Send, Rss } from "lucide-react";

const FOOTER_TITLE = "Built tastefully, for campus life";

const footerLinks = [
  { title: "Product", links: ["Features", "Solution", "Customers", "Pricing", "Help", "Terms"] },
  { title: "Resources", links: ["Help", "Tutorials", "API Reference", "Status", "Docs", "Templates"] },
  { title: "Company", links: ["About", "Careers", "Team", "Press", "Contact", "Privacy"] },
  { title: "Socials", links: ["X", "LinkedIn", "Facebook", "Threads", "Instagram", "Youtube"] },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Footer4() {
  return (
    <section className="bg-background">
      <motion.div
        className="w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <div className="flex h-full flex-col gap-4 md:flex-row">
          <motion.div
            className="relative flex min-h-[300px] w-full flex-col justify-between overflow-hidden rounded-none bg-foreground p-8 md:min-h-[600px] md:w-1/3 md:p-10"
            variants={itemVariants}
          >
            <div className="relative z-10 flex items-center gap-2 text-background">
              <svg className="h-7 w-auto" width="64" height="38" viewBox="0 0 64 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20.1032L39.8387 20.1032C44.7808 20.1032 48.7871 24.1095 48.7871 29.0516C48.7871 33.9937 44.7808 38 39.8387 38L0 38L0 20.1032Z" fill="currentColor" />
                <path d="M63.4968 17.8968L23.6581 17.8968C18.716 17.8968 14.7097 13.8904 14.7097 8.94839C14.7097 4.00633 18.716 0 23.6581 0L63.4968 0V17.8968Z" fill="currentColor" />
              </svg>
              <span className="font-heading text-xl font-bold tracking-tight">CampusFlow</span>
            </div>
            <div className="relative z-10 space-y-6">
              <h3 className="text-lg font-bold capitalize text-background">{FOOTER_TITLE}</h3>
              <div className="flex items-center gap-4 text-background/80">
                <Globe className="h-5 w-5" /><AtSign className="h-5 w-5" /><Send className="h-5 w-5" /><Rss className="h-5 w-5" />
              </div>
              <p className="text-xs text-background/70">&copy; {new Date().getFullYear()} CampusFlow, All rights reserved</p>
            </div>
          </motion.div>

          <motion.div
            className="flex min-h-[500px] w-full flex-col justify-between rounded-none border border-border bg-card p-8 md:min-h-[600px] md:w-2/3 md:p-12"
            variants={itemVariants}
          >
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-10">
              {footerLinks.map((section) => (
                <div key={section.title} className="flex flex-col space-y-6">
                  <h4 className="text-lg font-bold">{section.title}</h4>
                  <ul className="flex flex-col space-y-3 font-medium text-muted-foreground">
                    {section.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="transition-colors hover:text-foreground">{link}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-12 space-y-4 md:mt-0">
              <h4 className="text-lg font-bold">Newsletter</h4>
              <form
                className="flex w-full max-w-md flex-col gap-4 sm:flex-row"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  className="flex-1 rounded-md border border-border bg-transparent px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button className="rounded-md bg-foreground px-8 py-3 text-sm font-medium text-background transition-opacity hover:opacity-90">
                  Submit
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
