import React from "react";

interface Props {
  text: string;
}

const AutoLinkText: React.FC<Props> = ({ text }) => {
  const urlRegex = /https?:\/\/[^\s]+/g;

  const parts = text.split(urlRegex);
  const matches = text.match(urlRegex);

  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    elements.push(<span key={`text-${index}`}>{part}</span>);
    if (matches && matches[index]) {
      elements.push(
        <a
          key={`link-${index}`}
          href={matches[index]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#20C86E]"
        >
          {matches[index]}
        </a>
      );
    }
  });

  return <>{elements}</>;
};

export default AutoLinkText;
