// Tipos do ReceitAI

export interface QuizAnswer {
  question: string
  answer: string
}

export interface UserPreferences {
  // Dados pessoais e antropométricos
  age?: number
  gender?: string
  height?: number // em cm
  weight?: number // em kg
  bmi?: number
  bmi_category?: string
  
  // Objetivos e metas
  goal: string // perder peso, ganhar massa, manter peso, saúde geral
  activity_level: string
  target_weight?: number
  
  // Condições de saúde
  health_conditions: string[]
  medications?: string[]
  
  // Preferências alimentares
  dietary_restrictions: string[]
  cuisine_preferences: string[]
  spice_level: string
  meal_type: string
  allergies: string[]
  favorite_ingredients: string[]
  disliked_ingredients: string[]
  
  // Logística
  budget: string
  cooking_time: string
  serving_size: number
  
  // Motivação
  motivation: string
}

export interface Dish {
  id: string
  name: string
  description: string
  ingredients: string[]
  preparation_time: string
  difficulty: string
  cuisine_type: string
  dietary_info: string[]
  estimated_price: string
  calories?: number
  protein?: number
  carbs?: number
  fats?: number
  fiber?: number
  image_url?: string
  health_benefits?: string[]
}

export interface MenuResponse {
  dishes: Dish[]
  preferences_summary: string
  nutritional_summary?: string
  health_recommendations?: string[]
}

export interface Restaurant {
  name: string
  address: string
  distance: string
  rating?: number
  cuisine_type: string
}

export interface IngredientPrice {
  ingredient: string
  price: string
  store: string
  location: string
}
