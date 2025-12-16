import { createSlice } from '@reduxjs/toolkit'

const initialState = {
     news: [
          {
               TITLE: '',
               BODY: '',
               URL: '',
               KEYWORDS: '',
               SENTIMENT: 'POSITIVE',
               SOURCE: '',
               SOURCEIMAGE: '',
               DATE: '',
          },
     ],
     companyNews: [
          {
               TITLE: '',
               BODY: '',
               URL: '',
               KEYWORDS: '',
               SENTIMENT: 'POSITIVE',
               SOURCE: '',
               SOURCEIMAGE: '',
               DATE: '',
          },
     ],
     companyNewsCount: 0,
}

export const newsSlice = createSlice({
     name: 'news',
     initialState,
     reducers: {
          setNews: (state, action) => {
               state.news = action.payload
          },
          setCompanyNews: (state, action) => {
               state.companyNews = action.payload.news
               state.companyNewsCount = action.payload.count
          },
     },
})

export const { setNews, setCompanyNews } = newsSlice.actions

export default newsSlice.reducer
