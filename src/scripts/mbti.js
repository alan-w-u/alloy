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
  [1, 3, 3, 3, 1, 2, 3, 2, 3, 1, 0, 0, 1, 0, 0, 0], // INFP
  [3, 2, 2, 2, 3, 2, 3, 3, 1, 1, 0, 0, 1, 1, 0, 1], // ENFP
  [3, 3, 2, 3, 2, 2, 3, 3, 1, 0, 0, 1, 3, 1, 0, 0], // INFJ
  [3, 2, 3, 2, 2, 2, 2, 2, 1, 1, 0, 1, 1, 2, 0, 0], // ENFJ
  [2, 3, 3, 2, 3, 3, 3, 3, 0, 0, 1, 0, 0, 0, 1, 1], // INTJ
  [1, 3, 2, 2, 3, 3, 2, 2, 0, 0, 1, 1, 0, 1, 1, 1], // ENTJ
  [2, 2, 3, 1, 1, 3, 2, 3, 0, 0, 1, 0, 0, 0, 1, 0], // INTP
  [2, 2, 1, 1, 3, 3, 2, 2, 0, 1, 1, 3, 0, 0, 1, 1], // ENTP
  [3, 1, 1, 3, 0, 0, 1, 1, 1, 3, 3, 1, 2, 3, 2, 2], // ISFP
  [1, 1, 0, 1, 1, 0, 0, 1, 3, 2, 2, 2, 3, 3, 2, 2], // ESFP
  [0, 0, 0, 0, 1, 1, 1, 1, 3, 2, 2, 3, 1, 1, 2, 3], // ISTP
  [0, 0, 0, 0, 2, 0, 1, 1, 2, 3, 3, 2, 2, 2, 3, 3], // ESTP
  [1, 1, 2, 1, 0, 0, 0, 0, 2, 3, 2, 3, 2, 3, 3, 2], // ISFJ
  [2, 1, 1, 3, 0, 1, 0, 0, 3, 3, 2, 2, 2, 2, 2, 2], // ESFJ
  [0, 0, 1, 0, 2, 1, 1, 0, 2, 2, 3, 3, 3, 2, 3, 3], // ISTJ
  [0, 0, 0, 0, 0, 1, 0, 0, 2, 2, 3, 2, 3, 3, 3, 3], // ESTJ
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
