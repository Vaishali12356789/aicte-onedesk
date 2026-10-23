// Lightweight Semantic Keyword & Overlap Matching Algorithm
export function calculateSemanticOverlap(text1, text2) {
  if (!text1 || !text2) return { score: "0%", isMatch: false, reason: "Insufficient text" };

  const getKeywords = (str) =>
    new Set(
      str
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );

  const setA = getKeywords(text1);
  const setB = getKeywords(text2);

  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);

  if (union.size === 0) return { score: "0%", isMatch: false, reason: "No overlap" };

  const similarityRatio = intersection.size / union.size;
  const percentage = Math.round(similarityRatio * 100);

  // Trigger match if high similarity OR key overlapping concepts are present
  const keyMatch = intersection.has('fee') || intersection.has('charges') || intersection.has('development');
  const isMatch = percentage >= 25 || (keyMatch && intersection.size >= 2);

  return {
    score: `${percentage}%`,
    isMatch: isMatch,
    reason: `Matching key concepts detected: [${Array.from(intersection).join(', ')}]`
  };
}