import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { StatusBar } from 'expo-status-bar'
import { Platform, StatusBar as RNStatusBar } from 'react-native'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'
import RootNavigator from './src/navigation/RootNavigator'
import { store } from './src/store'
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#060b15',
  },
}

export default function App() {
  useEffect(() => {
    RNStatusBar.setHidden(true, 'fade')
    if (Platform.OS === 'android') {
      RNStatusBar.setBackgroundColor('transparent')
    }
  }, [])

  return (
    <Provider store={store}>
      <NavigationContainer theme={navTheme}>
        <StatusBar
          style='light'
          hidden
          backgroundColor='transparent'
          hideTransitionAnimation='fade'
        />
        <RootNavigator />
      </NavigationContainer>
    </Provider>
  )
}
