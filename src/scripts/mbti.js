const mbtiTypes = [
  "INFP",
  "ENFP",
  "INFJ",
  "ENFJ",
  "INTJ",
  "ENTJ",
  "INTP",
  "ENTP",
  "ISFP",
  "ESFP",
  "ISTP",
  "ESTP",
  "ISFJ",
  "ESFJ",
  "ISTJ",
  "ESTJ",
]

const compatibilityChart = [
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // INFP
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // ENFP
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // INFJ
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // ENFJ
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // INTJ
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // ENTJ
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // INTP
  [3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 1, 1, 2, 2, 1, 1], // ENTP
  [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 3, 3, 1, 1], // ISFP
  [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 3, 3, 1, 1], // ESFP
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3], // ISTP
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3], // ESTP
  [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 3, 3, 1, 1], // ISFJ
  [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 3, 3, 1, 1], // ESFJ
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3], // ISTJ
  [1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 2, 2, 3, 3], // ESTJ
]

export function getCompatibility(mbti) {
  const index = mbtiTypes.indexOf(mbti)
  if (index === -1) {
    return `Invalid MBTI type: ${mbti}`
  }

  const compatibilityScores = compatibilityChart[index]

  const veryCompatible = []
  const compatible = []
  const somewhatCompatible = []
  const incompatible = []

  compatibilityScores.forEach((score, i) => {
    const type = mbtiTypes[i]
    if (score === 3) veryCompatible.push(type)
    else if (score === 2) compatible.push(type)
    else if (score === 1) somewhatCompatible.push(type)
    else if (score === 0) incompatible.push(type)
  })

  return {
    "Very Compatible": veryCompatible,
    "Compatible": compatible,
    "Somewhat Compatible": somewhatCompatible,
    "Incompatible": incompatible,
  }
}
