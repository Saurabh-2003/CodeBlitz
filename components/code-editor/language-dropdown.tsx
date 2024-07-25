"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

enum Languages {
  CPP = "C++",
  JavaScript = "JavaScript",
  Python = "Python",
}

export function LanguageDropDown() {
  const [selectedLanguage, setSelectedLanguage] = React.useState<Languages>(
    Languages.CPP,
  );

  const getSelectedLanguage = () => {
    return selectedLanguage;
  };

  return (
    <Select
      value={selectedLanguage}
      onValueChange={(value) => setSelectedLanguage(value as Languages)}
    >
      <SelectTrigger className="w-[150px]  gap-1 h-6 text-xs">
        <SelectValue>{getSelectedLanguage()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.values(Languages).map((language) => (
          <SelectItem key={language} value={language}>
            {language}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
