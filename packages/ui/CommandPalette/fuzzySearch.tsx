import React from 'react';
import { Command } from './types';

interface SearchResult {
  command: Command;
  score: number;
  matches: number[];
}

export function fuzzyMatch(
  query: string,
  text: string
): { score: number; matches: number[] } {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const matches: number[] = [];

  if (!query) {
    return { score: 0, matches: [] };
  }

  if (textLower === queryLower) {
    return {
      score: 1000,
      matches: Array.from({ length: text.length }, (_, i) => i),
    };
  }

  const containsIndex = textLower.indexOf(queryLower);
  if (containsIndex >= 0) {
    const containsMatches = Array.from(
      { length: query.length },
      (_, i) => containsIndex + i
    );
    const positionBonus = containsIndex === 0 ? 200 : 100;
    return { score: 500 + positionBonus, matches: containsMatches };
  }

  let score = 0;
  let queryIndex = 0;
  let lastMatchIndex = -1;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matches.push(i);

      if (lastMatchIndex === i - 1) {
        score += 10;
      } else {
        score += 5;
      }

      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-') {
        score += 15;
      }

      if (text[i] === query[queryIndex] && text[i] === text[i].toUpperCase()) {
        score += 10;
      }

      lastMatchIndex = i;
      queryIndex++;
    }
  }

  if (queryIndex !== query.length) {
    return { score: 0, matches: [] };
  }

  score -= textLower.length;

  if (matches[0] === 0) {
    score += 50;
  }

  return { score: Math.max(0, score), matches };
}

export function searchCommands(
  query: string,
  commands: Command[],
  maxResults = 10
): SearchResult[] {
  if (!query.trim()) {
    return commands.slice(0, maxResults).map(command => ({
      command,
      score: 0,
      matches: [],
    }));
  }

  const results: SearchResult[] = [];

  for (const command of commands) {
    if (command.disabled) {
      continue;
    }

    const labelMatch = fuzzyMatch(query, command.label);

    const descMatch = command.description
      ? fuzzyMatch(query, command.description)
      : { score: 0, matches: [] };

    let keywordScore = 0;
    for (const keyword of command.keywords || []) {
      const match = fuzzyMatch(query, keyword);
      keywordScore = Math.max(keywordScore, match.score * 0.8);
    }

    const bestScore = Math.max(labelMatch.score, descMatch.score, keywordScore);

    if (bestScore > 0) {
      results.push({
        command,
        score: bestScore,
        matches: labelMatch.score >= descMatch.score ? labelMatch.matches : [],
      });
    }
  }

  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

export function highlightMatches(text: string, matches: number[]): React.ReactNode {
  if (!matches.length) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const matchIndex of matches) {
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    parts.push(
      <mark
        key={`match-${matchIndex}`}
        style={{
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: 'inherit',
          fontWeight: 600,
        }}
      >
        {text[matchIndex]}
      </mark>
    );

    lastIndex = matchIndex + 1;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
