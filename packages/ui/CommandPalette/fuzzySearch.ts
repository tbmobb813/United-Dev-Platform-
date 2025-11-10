/**
 * Fuzzy Search Utility
 *
 * Simple fuzzy search implementation for command matching
 */

import { Command } from './types';

interface SearchResult {
  command: Command;
  score: number;
  matches: number[];
}

/**
 * Calculate fuzzy match score for a string
 * @param query - Search query
 * @param text - Text to search in
 * @returns Score (higher is better) and match indices
 */
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

  // Exact match gets highest score
  if (textLower === queryLower) {
    return {
      score: 1000,
      matches: Array.from({ length: text.length }, (_, i) => i),
    };
  }

  // Contains match
  const containsIndex = textLower.indexOf(queryLower);
  if (containsIndex >= 0) {
    const containsMatches = Array.from(
      { length: query.length },
      (_, i) => containsIndex + i
    );
    // Higher score if match is at the start
    const positionBonus = containsIndex === 0 ? 200 : 100;
    return { score: 500 + positionBonus, matches: containsMatches };
  }

  // Fuzzy match - characters in order but not consecutive
  let score = 0;
  let queryIndex = 0;
  let lastMatchIndex = -1;

  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      matches.push(i);

      // Consecutive matches get bonus
      if (lastMatchIndex === i - 1) {
        score += 10;
      } else {
        score += 5;
      }

      // Match at word boundaries gets bonus
      if (i === 0 || text[i - 1] === ' ' || text[i - 1] === '-') {
        score += 15;
      }

      // Uppercase match in camelCase gets bonus
      if (text[i] === query[queryIndex] && text[i] === text[i].toUpperCase()) {
        score += 10;
      }

      lastMatchIndex = i;
      queryIndex++;
    }
  }

  // Must match all query characters
  if (queryIndex !== query.length) {
    return { score: 0, matches: [] };
  }

  // Prefer shorter strings
  score -= textLower.length;

  // Prefer matches at the start
  if (matches[0] === 0) {
    score += 50;
  }

  return { score: Math.max(0, score), matches };
}

/**
 * Search commands using fuzzy matching
 * @param query - Search query
 * @param commands - Commands to search
 * @param maxResults - Maximum results to return
 * @returns Sorted array of matching commands with scores
 */
export function searchCommands(
  query: string,
  commands: Command[],
  maxResults = 10
): SearchResult[] {
  if (!query.trim()) {
    // Return all commands when no query
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

    // Search in label
    const labelMatch = fuzzyMatch(query, command.label);

    // Search in description
    const descMatch = command.description
      ? fuzzyMatch(query, command.description)
      : { score: 0, matches: [] };

    // Search in keywords
    let keywordScore = 0;
    for (const keyword of command.keywords || []) {
      const match = fuzzyMatch(query, keyword);
      keywordScore = Math.max(keywordScore, match.score * 0.8); // Keywords worth slightly less
    }

    // Use best score
    const bestScore = Math.max(labelMatch.score, descMatch.score, keywordScore);

    if (bestScore > 0) {
      results.push({
        command,
        score: bestScore,
        matches: labelMatch.score >= descMatch.score ? labelMatch.matches : [],
      });
    }
  }

  // Sort by score (descending)
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Highlight matched characters in text
 * @param text - Text to highlight
 * @param matches - Indices of characters to highlight
 * @returns Text with highlighted portions
 */
export function highlightMatches(text: string, matches: number[]): React.ReactNode {
  if (!matches.length) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const matchIndex of matches) {
    // Add non-matched text
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Add matched character with highlight
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

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return <>{parts}</>;
}
