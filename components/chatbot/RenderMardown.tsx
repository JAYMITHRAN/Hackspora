"use client";

import "highlight.js/styles/tokyo-night-dark.css";

import { JetBrains_Mono } from "next/font/google";
import * as React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { Copy } from "lucide-react";

const jetBrains_Mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-JetBrains_Mono",
});

const md = `
# Hello World

This is a sample markdown with **code**, lists, and headings.

\`\`\`ts
console.log("Hello TypeScript");
\`\`\`

- Item 1
- Item 2
`;

export default function Blog({md}:String) {
  return (
    <>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          h1: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h1
                {...props}
                className="text-3xl scroll-m-60 font-bold text-foreground "
              >
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h2
                className="text-2xl font-semibold text-foreground "
                {...props}
              >
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h3
                className="text-xl scroll-m-36 font-semibold text-foreground "
                {...props}
              >
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h4
                className="text-lg font-semibold text-foreground "
                {...props}
              >
                {children}
              </h4>
            );
          },
          h5: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h5
                className="text-md font-semibold text-foreground "
                {...props}
              >
                {children}
              </h5>
            );
          },
          h6: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h6
                className="text-sm font-semibold text-foreground "
                {...props}
              >
                {children}
              </h6>
            );
          },
          p: ({ ...props }) => (
            <p
              className="leading-relaxed text-foreground font-normal  hyphens-auto"
              {...props}
            />
          ),
          code: ({ className, children, ...rest }) => {
            const language = className?.split("language-")[1];
            return language ? (
              <div className={`relative  ${jetBrains_Mono.className}`}>
                <div className="bg-[#1a1b26] rounded-t-xl py-3 px-3 font-normal flex justify-between items-center sticky top-15 border-border border-b">
                  <p className="text-white">{language}</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(children + "");
                    }}
                    className="transition-all delay-75 justify-between px-1 !py-1 !h-fit text-xs text-muted-foreground border border-muted-foreground bg-[oklch(0.269 0 0)] rounded-md hover:bg-[oklch(0.269 0 0)] hover:text-white tracking-tight"
                  >
                    Copy
                    <Copy />
                  </button>
                </div>
                <pre
                  className="overflow-x-auto custom-scroll rounded-b-xl bg-background"
                >
                  <code
                    className={`text-sm custom-scroll ${className} ${jetBrains_Mono.className}`}
                    {...rest}
                  >
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code
                className={`px-2 rounded-lg bg-[#0f16241d] text-[#23252ade] ${jetBrains_Mono.className}`}
                {...rest}
              >
                {children}
              </code>
            );
          },
          hr: ({ ...props }) => <hr className="my-2 border border-border" {...props} />,
          ul: ({ ...props }) => <ul className="list-disc pl-6 " {...props} />,
          ol: ({ ...props }) => <ol className="list-decimal pl-6 my-2" {...props} />,
          li: ({ ...props }) => (
            <li className=" leading-relaxed marker:text-foreground" {...props} />
          ),
          table: ({ ...props }) => (
            <table className="w-full my-6 border-collapse border border-border" {...props} />
          ),
          tbody: ({ ...props }) => <tbody className="divide-y divide-border" {...props} />,
          tr: ({ ...props }) => (
            <tr className="hover:bg-muted-foreground/10 transition-colors" {...props} />
          ),
          td: ({ ...props }) => <td className="p-4 border-b border-border" {...props} />,
          th: ({ ...props }) => <th className="p-4 border-b border-border" {...props} />,
          a: ({ ...props }) => (
            <a className="text-foreground underline" target="_blank" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-4 border-foreground pl-4 italic my-4 text-muted-foreground rounded-md"
              {...props}
            />
          ),
        }}
      >
        {md}
      </ReactMarkdown>
    </>
  );
}
