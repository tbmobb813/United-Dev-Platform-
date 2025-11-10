/**
 * Fuzzy Search Utilities
 *
 * Fuzzy matching and search algorithms for command palette
 */

import React from 'react';
import { Command } from './types';

export interface SearchResult {
  command: Command;
  score: number;
  matches: number[];
}

/**
 * Fuzzy match a query against text
 * Returns match score and character positions
 */
export function fuzzyMatch(
  query: string,
  text: string
): { score: number; matches: number[] } {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();

  // Exact match - highest score
  if (textLower === queryLower) {
    return {
      score: 1000,
      matches: Array.from({ length: query.length }, (_, i) => i),
    };
  }

  // Contains match - high score
  const containsIndex = textLower.indexOf(queryLower);
  if (containsIndex !== -1) {
    return {
      score: 700 - containsIndex * 10, // Earlier matches score higher
      matches: Array.from(
        { length: query.length },
        (_, i) => containsIndex + i
      ),
    };
  }

  // Fuzzy match - character by character
  let score = 0;
  let queryIndex = 0;
  const matches: number[] = [];
  let previousMatchIndex = -1;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matches.push(i);

      // Base score for match
      score += 10;

      // Bonus for consecutive characters
      if (previousMatchIndex === i - 1) {
        score += 15;
      }

      // Bonus for matching at word boundary
      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-') {
        score += 20;
      }

      // Bonus for camelCase matching
      if (i > 0 && text[i - 1] === text[i - 1].toLowerCase() && text[i] === text[i].toUpperCase()) {
        score += 15;
      }

      previousMatchIndex = i;
      queryIndex++;
    }
  }

  // Return 0 score if not all characters matched
  if (queryIndex < queryLower.length) {
    return { score: 0, matches: [] };
  }

  return { score, matches };
}

/**
 * Search commands with fuzzy matching
 */
export function searchCommands(
  query: string,
  commands: Command[],
  maxResults = 10
): SearchResult[] {
  if (!query.trim()) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const command of commands) {
    // Skip disabled commands
    if (command.disabled) {
      continue;
    }

    // Match against label
    const labelMatch = fuzzyMatch(query, command.label);

    // Match against description
    const descriptionMatch = command.description
      ? fuzzyMatch(query, command.description)
      : { score: 0, matches: [] };

    // Match against keywords
    let keywordScore = 0;
    if (command.keywords) {
      for (const keyword of command.keywords) {
        const keywordMatch = fuzzyMatch(query, keyword);
        keywordScore = Math.max(keywordScore, keywordMatch.score);
      }
    }

    // Use best match
    const bestScore = Math.max(
      labelMatch.score,
      descriptionMatch.score * 0.8, // Description matches worth slightly less
      keywordScore * 0.6 // Keyword matches worth even less
    );

    if (bestScore > 0) {
      results.push({
        command,
        score: bestScore,
        matches: labelMatch.score === bestScore ? labelMatch.matches : [],
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Return top results
  return results.slice(0, maxResults);
}

/**
 * Highlight matched characters in text
 */
export function highlightMatches(
  text: string,
  matches: number[]
): React.ReactNode {
  if (matches.length === 0) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (let i = 0; i < matches.length; i++) {
    const matchIndex = matches[i];

    // Add text before match
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Add highlighted match
    parts.push(
      React.createElement(
        'mark',
        {
          key: matchIndex,
          style: {
            backgroundColor: 'rgba(255, 215, 0, 0.4)',
            fontWeight: 600,
            padding: 0,
          },
        },
        text[matchIndex]
      )
    );

    lastIndex = matchIndex + 1;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return React.createElement(React.Fragment, null, ...parts);
}
