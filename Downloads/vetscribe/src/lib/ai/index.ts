import { mockAI } from './mockAI'
import { httpAI } from './httpAI'
export const aiService = import.meta.env.VITE_DEMO_MODE === 'false' ? httpAI : mockAI
