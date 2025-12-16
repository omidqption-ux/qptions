
const roomName = (mode, kind, userId) =>
     `${mode}:${kind}-${userId}`

export const changeBalanceEmitForTrade = (ioNs, { userId, balance, mode }) => {
     if (!ioNs || !userId || !balance || !mode) return
     // mode-scoped room
     ioNs.to(roomName(mode, 'balance', userId)).emit('balanceUpdate', { balance, mode })
}

export const changeBalanceEmit = (ioNs, { userId, balance }) => {
     if (!ioNs || !userId || !balance) return
     ioNs.to(roomName("real", 'balance', userId)).emit('balanceUpdate', { balance, mode: "real" })
}