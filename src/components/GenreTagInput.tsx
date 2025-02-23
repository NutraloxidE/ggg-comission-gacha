'use client'

import { useState } from 'react';
import { Input, Tag, TagLabel, TagCloseButton, Wrap, WrapItem } from '@chakra-ui/react';

export default function GenreTagInput() {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTags(prev => [...prev, inputValue.trim()]);
      setInputValue("");
      e.preventDefault();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <>
      <Input
        placeholder="ジャンルを入力してEnter"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Wrap mt={2}>
        {tags.map(tag => (
          <WrapItem key={tag}>
            <Tag size="lg" variant="solid" colorScheme="blue">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => removeTag(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </>
  );
}