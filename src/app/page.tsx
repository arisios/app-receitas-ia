"use client"

import { useState } from "react"
import { QuizCard } from "@/components/custom/quiz-card"
import { DishCard } from "@/components/custom/dish-card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, RefreshCw, Scale, Activity, Brain, CheckCircle2 } from "lucide-react"
import type { UserPreferences, Dish } from "@/lib/types"
import Image from "next/image"

// Perguntas estratégicas baseadas em ciência nutricional
const quizQuestions = [
  {
    question: "Qual é o seu principal objetivo nutricional?",
    type: "single" as const,
    options: [
      "Perder peso de forma saudável",
      "Ganhar massa muscular",
      "Manter peso e saúde",
      "Melhorar performance esportiva",
      "Controlar condição de saúde",
      "Aumentar energia e disposição"
    ],
    key: "goal",
    category: "Objetivos",
    analysisTemplate: (answer: string) => {
      const analyses: Record<string, string> = {
        "Perder peso de forma saudável": "Ótimo! Para perda de peso saudável, vamos focar em déficit calórico moderado (300-500 kcal), priorizando alimentos ricos em fibras e proteínas que promovem saciedade. Evitaremos dietas restritivas extremas.",
        "Ganhar massa muscular": "Perfeito! Para hipertrofia, vamos criar um superávit calórico controlado (+300-500 kcal) com alto teor proteico (1.6-2.2g/kg) distribuído ao longo do dia, combinado com carboidratos estratégicos.",
        "Manter peso e saúde": "Excelente! Vamos manter um equilíbrio calórico com foco em alimentos nutritivos, variados e anti-inflamatórios para promover saúde a longo prazo.",
        "Melhorar performance esportiva": "Ótimo objetivo! Vamos otimizar timing de nutrientes, carboidratos para energia, proteínas para recuperação e micronutrientes essenciais para performance.",
        "Controlar condição de saúde": "Muito importante! Vamos adaptar o cardápio considerando suas necessidades médicas específicas, com alimentos funcionais e anti-inflamatórios.",
        "Aumentar energia e disposição": "Ótimo! Vamos focar em estabilização de glicemia, alimentos de baixo índice glicêmico, hidratação adequada e nutrientes que combatem fadiga."
      }
      return analyses[answer] || "Vamos criar um cardápio personalizado para seu objetivo!"
    }
  },
  {
    question: "Informações do seu perfil físico",
    type: "combined" as const,
    fields: [
      { key: "age", label: "Idade (anos)", type: "number", placeholder: "Ex: 30" },
      { key: "height", label: "Altura (cm)", type: "number", placeholder: "Ex: 170" },
      { key: "weight", label: "Peso atual (kg)", type: "number", placeholder: "Ex: 70" },
      { key: "gender", label: "Sexo biológico", type: "text", placeholder: "Masculino/Feminino" }
    ],
    key: "profile",
    category: "Perfil",
    analysisTemplate: (answer: Record<string, string>) => {
      const height = parseFloat(answer.height)
      const weight = parseFloat(answer.weight)
      const age = parseInt(answer.age)
      
      if (height && weight) {
        const bmi = weight / Math.pow(height / 100, 2)
        const bmr = answer.gender?.toLowerCase().includes('masc') 
          ? 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
          : 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
        
        return `Seu IMC é ${bmi.toFixed(1)}. Sua Taxa Metabólica Basal (TMB) estimada é de ${Math.round(bmr)} kcal/dia. Vamos usar esses dados para calcular suas necessidades calóricas precisas.`
      }
      return "Dados registrados! Vamos calcular suas necessidades nutricionais."
    }
  },
  {
    question: "Qual é o seu nível de atividade física semanal?",
    type: "single" as const,
    options: [
      "Sedentário (pouco ou nenhum exercício)",
      "Levemente ativo (1-3x por semana)",
      "Moderadamente ativo (3-5x por semana)",
      "Muito ativo (6-7x por semana)",
      "Atleta (treino intenso diário)"
    ],
    key: "activity_level",
    category: "Estilo de Vida",
    analysisTemplate: (answer: string) => {
      const multipliers: Record<string, string> = {
        "Sedentário (pouco ou nenhum exercício)": "Multiplicador de atividade: 1.2x TMB. Vamos focar em alimentos nutritivos e densos para evitar excesso calórico.",
        "Levemente ativo (1-3x por semana)": "Multiplicador: 1.375x TMB. Bom equilíbrio! Vamos incluir carboidratos moderados para energia nos treinos.",
        "Moderadamente ativo (3-5x por semana)": "Multiplicador: 1.55x TMB. Ótima frequência! Carboidratos estratégicos e proteínas adequadas serão priorizados.",
        "Muito ativo (6-7x por semana)": "Multiplicador: 1.725x TMB. Alto gasto energético! Vamos garantir recuperação adequada com nutrientes específicos.",
        "Atleta (treino intenso diário)": "Multiplicador: 1.9x TMB. Demanda máxima! Timing de nutrientes, suplementação e periodização nutricional serão considerados."
      }
      return multipliers[answer] || "Nível de atividade registrado!"
    }
  },
  {
    question: "Você possui alguma condição de saúde que requer atenção nutricional?",
    type: "textarea" as const,
    placeholder: "Descreva condições como: diabetes, hipertensão, colesterol alto, problemas tireoidianos, SOP, resistência insulínica, doenças autoimunes, problemas digestivos (gastrite, refluxo, SII), alergias, intolerâncias, etc. Quanto mais detalhes, melhor!",
    key: "health_conditions",
    category: "Saúde",
    analysisTemplate: (answer: string) => {
      if (!answer || answer.trim() === "") {
        return "Nenhuma condição de saúde reportada. Vamos focar em prevenção e otimização da saúde geral."
      }
      const conditions = answer.toLowerCase()
      let analysis = "Condições identificadas! "
      
      if (conditions.includes('diabet')) {
        analysis += "Para diabetes: baixo índice glicêmico, fibras, controle de carboidratos. "
      }
      if (conditions.includes('hiper')) {
        analysis += "Para hipertensão: redução de sódio, aumento de potássio, DASH diet. "
      }
      if (conditions.includes('colesterol')) {
        analysis += "Para colesterol: ômega-3, fibras solúveis, redução de gorduras saturadas. "
      }
      if (conditions.includes('tireoi')) {
        analysis += "Para tireoide: selênio, iodo, zinco em quantidades adequadas. "
      }
      
      return analysis + "Vamos adaptar completamente seu cardápio!"
    }
  },
  {
    question: "Você possui alergias ou intolerâncias alimentares?",
    type: "textarea" as const,
    placeholder: "Liste TODAS as alergias e intolerâncias: lactose, glúten, amendoim, castanhas, frutos do mar, peixes, ovos, soja, milho, trigo, gergelim, sulfitos, corantes, conservantes, etc. Seja específico para sua segurança!",
    key: "allergies",
    category: "Saúde",
    analysisTemplate: (answer: string) => {
      if (!answer || answer.trim() === "") {
        return "Nenhuma alergia ou intolerância reportada. Teremos liberdade total na seleção de ingredientes!"
      }
      return `Alergias/intolerâncias registradas com MÁXIMA PRIORIDADE. Todos os ingredientes serão rigorosamente verificados para garantir sua segurança. Vamos encontrar alternativas deliciosas e seguras!`
    }
  },
  {
    question: "Você segue algum padrão alimentar específico?",
    type: "multiple" as const,
    options: [
      "Nenhuma restrição",
      "Vegetariano",
      "Vegano",
      "Sem lactose",
      "Sem glúten",
      "Low carb",
      "Cetogênica",
      "Paleo",
      "Mediterrânea"
    ],
    key: "dietary_restrictions",
    category: "Preferências",
    analysisTemplate: (answer: string[]) => {
      if (!answer || answer.length === 0 || answer.includes("Nenhuma restrição")) {
        return "Sem restrições alimentares! Teremos máxima flexibilidade para criar receitas variadas e nutritivas."
      }
      const patterns = answer.join(", ")
      return `Padrão alimentar: ${patterns}. Vamos respeitar completamente suas escolhas e criar receitas deliciosas dentro desses parâmetros!`
    }
  },
  {
    question: "Quais refeições você precisa no seu cardápio?",
    type: "multiple" as const,
    options: [
      "Café da manhã",
      "Lanche da manhã",
      "Almoço",
      "Lanche da tarde",
      "Jantar",
      "Ceia"
    ],
    key: "meal_times",
    category: "Rotina",
    analysisTemplate: (answer: string[]) => {
      const count = answer.length
      return `${count} refeições diárias selecionadas. Vamos distribuir suas calorias e macronutrientes de forma otimizada ao longo do dia para manter energia constante e atingir seus objetivos!`
    }
  },
  {
    question: "Quanto tempo você tem disponível para cozinhar por refeição?",
    type: "single" as const,
    options: [
      "Menos de 15 minutos",
      "15-30 minutos",
      "30-45 minutos",
      "45-60 minutos",
      "Mais de 1 hora"
    ],
    key: "cooking_time",
    category: "Rotina",
    analysisTemplate: (answer: string) => {
      const timeAdvice: Record<string, string> = {
        "Menos de 15 minutos": "Receitas rápidas! Vamos focar em meal prep, receitas de uma panela e opções práticas sem perder qualidade nutricional.",
        "15-30 minutos": "Tempo ideal para receitas equilibradas! Vamos incluir opções práticas mas saborosas e nutritivas.",
        "30-45 minutos": "Ótimo tempo! Podemos incluir receitas mais elaboradas e técnicas culinárias interessantes.",
        "45-60 minutos": "Tempo generoso! Vamos explorar receitas mais complexas e técnicas avançadas de cozinha.",
        "Mais de 1 hora": "Tempo excelente! Podemos incluir receitas gourmet, fermentações, preparos lentos e técnicas sofisticadas."
      }
      return timeAdvice[answer] || "Tempo de preparo registrado!"
    }
  },
  {
    question: "Qual é o seu nível de habilidade culinária?",
    type: "single" as const,
    options: [
      "Iniciante (receitas simples)",
      "Intermediário (receitas moderadas)",
      "Avançado (receitas complexas)",
      "Chef (qualquer complexidade)"
    ],
    key: "cooking_skill",
    category: "Contexto",
    analysisTemplate: (answer: string) => {
      const skillAdvice: Record<string, string> = {
        "Iniciante (receitas simples)": "Perfeito! Vamos incluir instruções detalhadas, técnicas básicas e receitas fáceis de seguir. Você vai aprender enquanto cozinha!",
        "Intermediário (receitas moderadas)": "Ótimo nível! Vamos incluir receitas variadas com algumas técnicas interessantes para você continuar evoluindo.",
        "Avançado (receitas complexas)": "Excelente! Podemos incluir técnicas avançadas, combinações sofisticadas e preparos mais elaborados.",
        "Chef (qualquer complexidade)": "Incrível! Vamos explorar o máximo da culinária com técnicas profissionais, ingredientes especiais e preparos gourmet."
      }
      return skillAdvice[answer] || "Nível de habilidade registrado!"
    }
  },
  {
    question: "Qual é o seu orçamento aproximado por refeição?",
    type: "single" as const,
    options: [
      "Econômico (até R$15/refeição)",
      "Moderado (R$15-30/refeição)",
      "Confortável (R$30-50/refeição)",
      "Premium (acima de R$50/refeição)"
    ],
    key: "budget",
    category: "Contexto",
    analysisTemplate: (answer: string) => {
      const budgetAdvice: Record<string, string> = {
        "Econômico (até R$15/refeição)": "Orçamento consciente! Vamos priorizar ingredientes acessíveis, sazonais e versáteis, sem comprometer a qualidade nutricional.",
        "Moderado (R$15-30/refeição)": "Orçamento equilibrado! Podemos incluir ingredientes de boa qualidade com algumas opções especiais ocasionais.",
        "Confortável (R$30-50/refeição)": "Ótimo orçamento! Vamos incluir ingredientes premium, orgânicos e cortes nobres quando apropriado.",
        "Premium (acima de R$50/refeição)": "Orçamento premium! Vamos explorar ingredientes especiais, importados, orgânicos e preparos gourmet."
      }
      return budgetAdvice[answer] || "Orçamento registrado!"
    }
  },
  {
    question: "Quais ingredientes você ADORA e gostaria de ver mais no cardápio?",
    type: "multiple" as const,
    options: [
      "Frango",
      "Carne vermelha",
      "Peixes",
      "Ovos",
      "Legumes",
      "Frutas",
      "Grãos integrais",
      "Laticínios",
      "Oleaginosas",
      "Massas"
    ],
    key: "favorite_ingredients",
    category: "Preferências",
    analysisTemplate: (answer: string[]) => {
      if (!answer || answer.length === 0) {
        return "Sem preferências específicas. Vamos criar um cardápio variado e equilibrado!"
      }
      return `Ingredientes favoritos identificados: ${answer.join(", ")}. Vamos priorizar esses alimentos nas receitas, garantindo variedade e prazer ao comer!`
    }
  },
  {
    question: "Há ingredientes que você NÃO GOSTA ou prefere evitar?",
    type: "textarea" as const,
    placeholder: "Liste ingredientes que você não gosta: cebola, alho, pimentão, tomate, cogumelos, azeitonas, coentro, berinjela, abobrinha, brócolis, couve-flor, beterraba, cenoura, etc. Seja honesto para garantir que você vai gostar das receitas!",
    key: "disliked_ingredients",
    category: "Preferências",
    analysisTemplate: (answer: string) => {
      if (!answer || answer.trim() === "") {
        return "Nenhum ingrediente a evitar. Teremos total liberdade criativa no cardápio!"
      }
      return `Ingredientes a evitar registrados. Vamos criar receitas deliciosas SEM esses ingredientes, usando alternativas saborosas que você vai adorar!`
    }
  }
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, string>>>({})
  const [additionalDetails, setAdditionalDetails] = useState<Record<number, string>>({})
  const [currentAnalysis, setCurrentAnalysis] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [dishes, setDishes] = useState<Dish[]>([])
  const [preferencesSummary, setPreferencesSummary] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [bmiInfo, setBmiInfo] = useState<{ bmi: number; category: string; status: string } | null>(null)

  const currentQuestion = quizQuestions[currentStep - 1]

  const calculateBMI = (height: number, weight: number) => {
    const h = height / 100
    const bmi = weight / (h * h)

    let category = ""
    let status = ""
    
    if (bmi < 18.5) {
      category = "Abaixo do peso"
      status = "Você está abaixo do peso ideal. Vamos criar um cardápio hipercalórico nutritivo para ganho de peso saudável, com foco em alimentos densos em nutrientes."
    } else if (bmi < 25) {
      category = "Peso normal"
      status = "Parabéns! Você está no peso ideal. Vamos criar um cardápio equilibrado para manter sua saúde e bem-estar."
    } else if (bmi < 30) {
      category = "Sobrepeso"
      status = "Você está com sobrepeso. Vamos criar um cardápio com déficit calórico moderado, rico em fibras e proteínas para promover saciedade e perda de peso saudável."
    } else if (bmi < 35) {
      category = "Obesidade grau I"
      status = "Você está com obesidade grau I. Vamos criar um cardápio estruturado com déficit calórico controlado, priorizando alimentos anti-inflamatórios e de baixo índice glicêmico."
    } else if (bmi < 40) {
      category = "Obesidade grau II"
      status = "Você está com obesidade grau II. Vamos criar um cardápio terapêutico com acompanhamento nutricional recomendado, focando em mudanças sustentáveis de longo prazo."
    } else {
      category = "Obesidade grau III"
      status = "Você está com obesidade grau III. Vamos criar um cardápio adaptado às suas necessidades, mas recomendamos fortemente acompanhamento médico e nutricional especializado."
    }

    return { bmi: parseFloat(bmi.toFixed(1)), category, status }
  }

  const handleAnswerChange = (value: string | string[] | Record<string, string>) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }))

    // Gerar análise em tempo real
    if (currentQuestion.analysisTemplate) {
      const analysis = currentQuestion.analysisTemplate(value as any)
      setCurrentAnalysis(analysis)
    }
  }

  const handleAdditionalDetailsChange = (value: string) => {
    setAdditionalDetails(prev => ({
      ...prev,
      [currentStep]: value
    }))
  }

  const handleNext = async () => {
    if (currentStep < quizQuestions.length) {
      setCurrentStep(prev => prev + 1)
      setCurrentAnalysis("") // Limpar análise ao mudar de pergunta
    } else {
      await generateMenu()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      setCurrentAnalysis("") // Limpar análise ao voltar
    }
  }

  const generateMenu = async () => {
    setLoading(true)
    try {
      const profile = answers.profile as Record<string, string>
      const age = profile?.age ? parseInt(profile.age) : undefined
      const height = profile?.height ? parseInt(profile.height) : undefined
      const weight = profile?.weight ? parseInt(profile.weight) : undefined
      const gender = profile?.gender || undefined

      let bmiData = null
      if (height && weight) {
        bmiData = calculateBMI(height, weight)
        setBmiInfo(bmiData)
      }

      // Compilar todos os detalhes adicionais
      const allAdditionalDetails = Object.values(additionalDetails).filter(d => d.trim() !== "").join(" | ")

      const preferences: UserPreferences = {
        goal: answers.goal as string || "Melhorar saúde geral",
        gender,
        age,
        height,
        weight,
        bmi: bmiData?.bmi,
        bmi_category: bmiData?.category,
        activity_level: answers.activity_level as string || "Moderadamente ativo",
        health_conditions: typeof answers.health_conditions === 'string' 
          ? [answers.health_conditions] 
          : (answers.health_conditions as string[]) || [],
        dietary_restrictions: (answers.dietary_restrictions as string[]) || [],
        cuisine_preferences: [],
        spice_level: "Moderado",
        budget: answers.budget as string || "Moderado",
        cooking_time: answers.cooking_time as string || "15-30 minutos",
        meal_type: (answers.meal_times as string[])?.join(", ") || "Almoço",
        allergies: typeof answers.allergies === 'string'
          ? [answers.allergies]
          : (answers.allergies as string[]) || [],
        favorite_ingredients: (answers.favorite_ingredients as string[]) || [],
        disliked_ingredients: typeof answers.disliked_ingredients === 'string'
          ? [answers.disliked_ingredients]
          : (answers.disliked_ingredients as string[]) || [],
        serving_size: 1,
        motivation: "",
        cooking_skill: answers.cooking_skill as string || "Intermediário",
        additional_context: allAdditionalDetails
      }

      const response = await fetch('/api/generate-menu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Erro ao gerar cardápio')
      }

      const data = await response.json()
      setDishes(data.dishes)
      setPreferencesSummary(data.preferences_summary)
      setShowResults(true)
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao gerar cardápio. Verifique se a chave da OpenAI está configurada.')
    } finally {
      setLoading(false)
    }
  }

  const resetQuiz = () => {
    setCurrentStep(1)
    setAnswers({})
    setAdditionalDetails({})
    setCurrentAnalysis("")
    setDishes([])
    setShowResults(false)
    setPreferencesSummary("")
    setBmiInfo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="text-center space-y-8 max-w-2xl">
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-pulse" />
            <Image
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0e4f0f90-4258-4565-af8f-aa5bb858b61d.png"
              alt="ReceitAI Logo"
              width={140}
              height={140}
              className="relative animate-pulse drop-shadow-2xl"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Brain className="w-8 h-8 text-orange-500 animate-pulse" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
                Analisando seu perfil
              </h2>
              <Sparkles className="w-8 h-8 text-pink-500 animate-pulse" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Nossa IA está processando suas respostas e criando um cardápio personalizado baseado em ciência nutricional, suas preferências e objetivos...
            </p>
          </div>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center">
              <Image
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0e4f0f90-4258-4565-af8f-aa5bb858b61d.png"
                alt="ReceitAI Logo"
                width={80}
                height={80}
              />
            </div>
            
            {bmiInfo && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl border-2 border-orange-200 dark:border-orange-800">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Scale className="w-7 h-7 text-orange-500" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Análise do Seu Perfil</h3>
                </div>
                
                <div className="flex items-center justify-center gap-8 mb-6">
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Índice de Massa Corporal</p>
                    <p className="text-5xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                      {bmiInfo.bmi}
                    </p>
                  </div>
                  <div className="h-20 w-px bg-gradient-to-b from-orange-300 to-red-300 dark:from-orange-700 dark:to-red-700" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Classificação</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{bmiInfo.category}</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-4">
                    <Activity className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {bmiInfo.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl border-2 border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-center gap-3 mb-6">
                <CheckCircle2 className="w-7 h-7 text-green-500" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Seu Cardápio Personalizado</h3>
              </div>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {preferencesSummary}
              </p>
            </div>

            <Button
              onClick={resetQuiz}
              variant="outline"
              size="lg"
              className="gap-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950 font-semibold px-8 py-6 rounded-xl"
            >
              <RefreshCw className="w-5 h-5" />
              Criar Novo Cardápio
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-full blur-2xl opacity-20 animate-pulse" />
              <Image
                src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0e4f0f90-4258-4565-af8f-aa5bb858b61d.png"
                alt="ReceitAI Logo"
                width={120}
                height={120}
                priority
                className="relative drop-shadow-2xl"
              />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent">
              ReceitAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Cardápios personalizados baseados em ciência nutricional, criados especialmente para você
            </p>
          </div>
        </div>

        <QuizCard
          step={currentStep}
          totalSteps={quizQuestions.length}
          question={currentQuestion.question}
          category={currentQuestion.category}
          type={currentQuestion.type}
          options={currentQuestion.options}
          value={answers[currentQuestion.key] || (currentQuestion.type === 'multiple' ? [] : currentQuestion.type === 'combined' ? {} : '')}
          onChange={handleAnswerChange}
          onNext={handleNext}
          onPrevious={handlePrevious}
          placeholder={currentQuestion.placeholder}
          fields={currentQuestion.fields}
          additionalDetails={additionalDetails[currentStep] || ""}
          onAdditionalDetailsChange={handleAdditionalDetailsChange}
          analysis={currentAnalysis}
        />
      </div>
    </div>
  )
}
