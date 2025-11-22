"use client"

import { useState } from "react"
import { QuizCard } from "@/components/custom/quiz-card"
import { DishCard } from "@/components/custom/dish-card"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles, RefreshCw, Scale, Activity } from "lucide-react"
import type { UserPreferences, Dish } from "@/lib/types"
import Image from "next/image"

const quizQuestions = [
  {
    question: "Qual é o seu principal objetivo com a alimentação?",
    type: "single" as const,
    options: [
      "Perder peso",
      "Ganhar massa muscular",
      "Manter peso atual",
      "Melhorar saúde geral",
      "Controlar condição médica",
      "Aumentar energia"
    ],
    key: "goal",
    category: "Objetivos"
  },
  {
    question: "Informações básicas sobre você",
    type: "combined" as const,
    fields: [
      { key: "age", label: "Idade (anos)", type: "number", placeholder: "Ex: 30" },
      { key: "height", label: "Altura (cm)", type: "number", placeholder: "Ex: 170" },
      { key: "weight", label: "Peso (kg)", type: "number", placeholder: "Ex: 70" },
      { key: "gender", label: "Sexo", type: "text", placeholder: "Masculino, Feminino ou Outro" }
    ],
    key: "profile",
    category: "Perfil"
  },
  {
    question: "Qual é o seu nível de atividade física?",
    type: "single" as const,
    options: [
      "Sedentário",
      "Levemente ativo",
      "Moderadamente ativo",
      "Muito ativo",
      "Extremamente ativo"
    ],
    key: "activity_level",
    category: "Estilo de Vida"
  },
  {
    question: "Você possui alguma condição de saúde que pode ser afetada pela alimentação?",
    type: "textarea" as const,
    placeholder: "Descreva suas condições de saúde (diabetes, hipertensão, colesterol alto, problemas cardíacos, renais, digestivos, anemia, etc.). Quanto mais detalhes, melhor será o cardápio personalizado.",
    key: "health_conditions",
    category: "Saúde"
  },
  {
    question: "Você tem alguma restrição ou preferência alimentar?",
    type: "multiple" as const,
    options: [
      "Nenhuma",
      "Vegetariano",
      "Vegano",
      "Sem lactose",
      "Sem glúten",
      "Low carb",
      "Cetogênica",
      "Jejum intermitente",
      "Dieta mediterrânea",
      "Kosher",
      "Halal",
      "Paleo",
      "Sem açúcar"
    ],
    key: "dietary_restrictions",
    category: "Preferências"
  },
  {
    question: "Você possui alguma alergia alimentar?",
    type: "textarea" as const,
    placeholder: "Liste todas as suas alergias alimentares (amendoim, castanhas, frutos do mar, peixes, ovos, leite, soja, trigo, gergelim, sulfitos, corantes, etc.). Seja específico para garantir sua segurança.",
    key: "allergies",
    category: "Saúde"
  },
  {
    question: "Quais tipos de cozinha você prefere?",
    type: "multiple" as const,
    options: [
      "Brasileira",
      "Italiana",
      "Japonesa",
      "Mexicana",
      "Árabe",
      "Francesa",
      "Chinesa",
      "Indiana",
      "Tailandesa",
      "Mediterrânea",
      "Americana",
      "Coreana"
    ],
    key: "cuisine_preferences",
    category: "Preferências"
  },
  {
    question: "Qual seu nível de tempero preferido?",
    type: "single" as const,
    options: [
      "Suave",
      "Moderado",
      "Picante",
      "Muito picante"
    ],
    key: "spice_level",
    category: "Preferências"
  },
  {
    question: "Quais são seus ingredientes favoritos?",
    type: "multiple" as const,
    options: [
      "Frango",
      "Carne bovina",
      "Carne suína",
      "Peixes",
      "Frutos do mar",
      "Ovos",
      "Queijos",
      "Iogurte",
      "Massas",
      "Arroz",
      "Batata",
      "Batata-doce",
      "Feijão",
      "Vegetais verdes",
      "Frutas",
      "Castanhas",
      "Abacate",
      "Cogumelos"
    ],
    key: "favorite_ingredients",
    category: "Preferências"
  },
  {
    question: "Há ingredientes que você não gosta ou evita?",
    type: "textarea" as const,
    placeholder: "Liste ingredientes que você não gosta ou prefere evitar (cebola, alho, pimentão, tomate, cogumelos, azeitonas, coentro, berinjela, abobrinha, brócolis, couve-flor, beterraba, cenoura, etc.).",
    key: "disliked_ingredients",
    category: "Preferências"
  },
  {
    question: "Qual seu orçamento por refeição?",
    type: "single" as const,
    options: [
      "Econômico",
      "Moderado",
      "Confortável",
      "Premium"
    ],
    key: "budget",
    category: "Logística"
  },
  {
    question: "Quanto tempo você tem disponível para preparar suas refeições?",
    type: "single" as const,
    options: [
      "Menos de 20 minutos",
      "20-40 minutos",
      "40-60 minutos",
      "Mais de 1 hora"
    ],
    key: "cooking_time",
    category: "Logística"
  },
  {
    question: "Que tipo de refeição você está buscando?",
    type: "single" as const,
    options: [
      "Café da manhã",
      "Almoço",
      "Jantar",
      "Lanche",
      "Sobremesa",
      "Refeição completa"
    ],
    key: "meal_type",
    category: "Logística"
  },
  {
    question: "Para quantas pessoas você está planejando?",
    type: "single" as const,
    options: [
      "1 pessoa",
      "2 pessoas",
      "3-4 pessoas",
      "5-6 pessoas",
      "Mais de 6 pessoas"
    ],
    key: "serving_size",
    category: "Logística"
  },
  {
    question: "O que mais te motiva a melhorar sua alimentação?",
    type: "single" as const,
    options: [
      "Saúde e bem-estar",
      "Estética",
      "Performance",
      "Prevenção",
      "Qualidade de vida",
      "Recomendação médica"
    ],
    key: "motivation",
    category: "Motivação"
  }
]

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<Record<string, string | string[] | Record<string, string>>>({})
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
      status = "Você está abaixo do peso ideal. É importante aumentar a ingestão calórica de forma saudável."
    } else if (bmi < 25) {
      category = "Peso normal"
      status = "Parabéns! Você está no peso ideal. Continue mantendo hábitos saudáveis."
    } else if (bmi < 30) {
      category = "Sobrepeso"
      status = "Você está com sobrepeso. Recomendamos uma alimentação balanceada e atividade física regular."
    } else if (bmi < 35) {
      category = "Obesidade grau I"
      status = "Você está com obesidade grau I. É importante buscar orientação profissional para melhorar sua saúde."
    } else if (bmi < 40) {
      category = "Obesidade grau II"
      status = "Você está com obesidade grau II. Recomendamos acompanhamento médico e nutricional."
    } else {
      category = "Obesidade grau III"
      status = "Você está com obesidade grau III. É essencial buscar acompanhamento médico especializado."
    }

    return { bmi: parseFloat(bmi.toFixed(1)), category, status }
  }

  const handleAnswerChange = (value: string | string[] | Record<string, string>) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: value
    }))
  }

  const handleNext = async () => {
    if (currentStep < quizQuestions.length) {
      setCurrentStep(prev => prev + 1)
    } else {
      await generateMenu()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const generateMenu = async () => {
    setLoading(true)
    try {
      // Processar dados do perfil combinado
      const profile = answers.profile as Record<string, string>
      const age = profile?.age ? parseInt(profile.age) : undefined
      const height = profile?.height ? parseInt(profile.height) : undefined
      const weight = profile?.weight ? parseInt(profile.weight) : undefined
      const gender = profile?.gender || undefined

      // Calcular IMC se altura e peso foram fornecidos
      let bmiData = null
      if (height && weight) {
        bmiData = calculateBMI(height, weight)
        setBmiInfo(bmiData)
      }

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
        cuisine_preferences: (answers.cuisine_preferences as string[]) || [],
        spice_level: answers.spice_level as string || "Moderado",
        budget: answers.budget as string || "Moderado",
        cooking_time: answers.cooking_time as string || "20-40 minutos",
        meal_type: answers.meal_type as string || "Almoço",
        allergies: typeof answers.allergies === 'string'
          ? [answers.allergies]
          : (answers.allergies as string[]) || [],
        favorite_ingredients: (answers.favorite_ingredients as string[]) || [],
        disliked_ingredients: typeof answers.disliked_ingredients === 'string'
          ? [answers.disliked_ingredients]
          : (answers.disliked_ingredients as string[]) || [],
        serving_size: parseInt((answers.serving_size as string)?.charAt(0) || "2"),
        motivation: answers.motivation as string || ""
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
    setDishes([])
    setShowResults(false)
    setPreferencesSummary("")
    setBmiInfo(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 dark:from-gray-950 dark:to-gray-900">
        <div className="text-center space-y-8">
          <div className="relative flex justify-center">
            <Image
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0e4f0f90-4258-4565-af8f-aa5bb858b61d.png"
              alt="ReceitAI Logo"
              width={120}
              height={120}
              className="animate-pulse"
            />
            <Sparkles className="w-8 h-8 text-orange-500 absolute -top-2 -right-2 animate-pulse" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Criando seu cardápio personalizado
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Nossa IA está analisando suas preferências e condições de saúde para criar o cardápio perfeito para você...
            </p>
          </div>
          <Loader2 className="w-10 h-10 animate-spin mx-auto text-orange-500" />
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen p-4 sm:p-6 md:p-8 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 dark:from-gray-950 dark:to-gray-900">
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
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-2xl mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Scale className="w-6 h-6 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Seu Perfil de Saúde</h3>
                </div>
                
                <div className="flex items-center justify-center gap-6 mb-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">IMC</p>
                    <p className="text-4xl font-bold text-orange-500">{bmiInfo.bmi}</p>
                  </div>
                  <div className="h-16 w-px bg-gray-300 dark:bg-gray-600" />
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Classificação</p>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{bmiInfo.category}</p>
                  </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-950/30 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {bmiInfo.status}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-3xl mx-auto shadow-lg border border-gray-200 dark:border-gray-700">
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                {preferencesSummary}
              </p>
            </div>

            <Button
              onClick={resetQuiz}
              variant="outline"
              className="gap-2 border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950"
            >
              <RefreshCw className="w-4 h-4" />
              Fazer novo quiz
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-white via-orange-50/30 to-red-50/30 dark:from-gray-950 dark:to-gray-900">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center">
            <Image
              src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/0e4f0f90-4258-4565-af8f-aa5bb858b61d.png"
              alt="ReceitAI Logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">
              ReceitAI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Cardápios personalizados com base no seu perfil de saúde e objetivos
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
        />
      </div>
    </div>
  )
}
