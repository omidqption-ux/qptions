import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { PersistGate } from 'redux-persist/integration/react'
import store, { persistor } from './redux/store'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { SnackbarProvider } from 'notistack'
const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
     <React.StrictMode>
          <Provider store={store}>
               <PersistGate
                    loading={null}
                    persistor={persistor}
               >
                    <SnackbarProvider maxSnack={5}>
                         <App />
                    </SnackbarProvider>
                    <ToastContainer
                         position='top-right'
                         autoClose={3000}
                         hideProgressBar={false}
                         newestOnTop
                         closeOnClick
                         rtl={false}
                         pauseOnFocusLoss
                         draggable={false}
                         pauseOnHover
                         theme='dark'
                         style={{
                              fontSize: '12px', // Set a smaller font size
                         }}
                    />
               </PersistGate>
          </Provider>
     </React.StrictMode>
)
