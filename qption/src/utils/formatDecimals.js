export function formatDecimals(num, maxDecimals = 6) {
    const str = num.toString();
    if (str.includes('.')) {
        const decimals = str.split('.')[1].length;
        return parseFloat(decimals > maxDecimals ? num.toFixed(maxDecimals) : str);
    }
    return num;
}