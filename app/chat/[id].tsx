import { ThemedText } from '@/components/themed-text'
import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { View } from 'react-native'

const ChatByIdScreen = () => {

    const { id } = useLocalSearchParams()

  return (
    <View style={{marginHorizontal: 10, flex: 1, marginTop: 10}}>
      <ThemedText>ChartId:</ThemedText>
      <ThemedText style={{ height: 100,fontSize: 32, fontWeight: 'bold', textAlign: 'center'}}>{id}</ThemedText>
    </View>
  )
}

export default ChatByIdScreen