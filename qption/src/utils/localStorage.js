export const setItem = (name,value)=>{
    localStorage.setItem(name,value)
    return value;
} 
export const  getItem = (name)=>{
    if (typeof window === 'undefined') {
        return ""
      } else {
        return localStorage.getItem(name)
      }
}  