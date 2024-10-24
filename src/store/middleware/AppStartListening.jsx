import { createListenerMiddleware, addListener } from '@reduxjs/toolkit'
import { store } from '../../index.js'

export const listenerMiddleware = createListenerMiddleware()

export const startAppListening = listenerMiddleware.startListening

export const addAppListener = addListener