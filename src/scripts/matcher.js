import { getCompatibility } from './mbti'

export function createGroupsByMbti(users, groupSize) {
    const groups = []
    const used = new Set()

    while (used.size < users.length) {
        const group = []
        let seedIndex = null

        // Find the first available user to start the group
        for (let i = 0; i < users.length; i++) {
            if (!used.has(i)) {
                seedIndex = i
                break
            }
        }

        if (seedIndex === null) break // All users have been grouped

        // initialize first user
        const [seedName, seedMbti] = users[seedIndex]
        group.push(seedName)
        used.add(seedIndex)

        const compatibilityRanking = getCompatibility(seedMbti)

        // Fill the group based on compatibility ranking (start with VeryCompatible)
        for (const rank of ['Very Compatible', 'Compatible', 'Somewhat Compatible', 'Incompatible']) {
            if (group.length === groupSize) break
            for (let j = 0; j < users.length; j++) {
                if (used.has(j)) continue
                const [candidateName, candidateMbti] = users[j]

                if (compatibilityRanking[rank].includes(candidateMbti)) {
                    group.push(candidateName)
                    used.add(j)
                    if (group.length === groupSize) break
                }
            }
            if (group.length === groupSize) break
        }

        groups.push(group)
    }

    // Handle remaining users if they don't fit into a full group
    const remainingUsers = users.filter((_, index) => !used.has(index))
    if (remainingUsers.length > 0) {
        groups.push(remainingUsers.map(user => user[0]))
    }

    return groups
}