export function toCamelCase(str) {
     return str
          .toLowerCase() // Convert the string to lowercase
          .replace(/[-_ ]+([a-z])/g, (_, char) => char.toUpperCase()) // Capitalize letters after delimiters
          .replace(/[-_ ]+/g, '') // Remove remaining delimiters
}
export function toCamelCaseWithSpaces(str) {
     return str
          .toLowerCase() // Convert the string to lowercase
          .replace(/[-_]+/g, ' ') // Replace dashes or underscores with spaces
          .replace(/\b([a-z])/g, (match) => match.toUpperCase()) // Capitalize the first letter of each word
          .replace(/\s([A-Z])/g, (match) => match.toLowerCase()) // Lowercase subsequent words
}

export const removeSlash = (str) => {
     return str.replace(/\/(?=.)/, '') // Removes the first occurrence of '/' from the middle
}

export const removeSpaces = (str) => {
     return str.replace(/ /g, '') // Replace all spaces globally
}

export function capitalizeFirstLetter(string) {
     return string.charAt(0).toUpperCase() + string.slice(1)
}
