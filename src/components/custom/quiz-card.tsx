"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  ChevronRight, 
  ChevronLeft, 
  Heart, 
  User, 
  Circle, 
  Zap,
  Shield,
  AlertTriangle,
  Info,
  Check,
  Target,
  TrendingDown,
  TrendingUp,
  Activity,
  Dumbbell,
  Flame,
  Apple,
  Leaf,
  Fish,
  Beef,
  Egg,
  Milk,
  Wheat,
  Cookie,
  Salad,
  Coffee,
  Soup,
  UtensilsCrossed,
  ChefHat,
  Timer,
  DollarSign,
  Scale,
  Cake,
  Mic,
  Sparkles,
  Brain,
  CheckCircle2
} from "lucide-react"

interface QuizCardProps {
  step: number
  totalSteps: number
  question: string
  category: string
  type: 'single' | 'multiple' | 'text' | 'textarea' | 'combined'
  options?: string[]
  value: string | string[] | Record<string, string>
  onChange: (value: string | string[] | Record<string, string>) => void
  onNext: () => void
  onPrevious: () => void
  placeholder?: string
  fields?: Array<{ key: string; label: string; type: string; placeholder: string }>
  additionalDetails?: string
  onAdditionalDetailsChange?: (value: string) => void
  analysis?: string
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Objetivos": <Target className="w-5 h-5" />,
  "Perfil": <User className="w-5 h-5" />,
  "Saúde": <Heart className="w-5 h-5" />,
  "Preferências": <Apple className="w-5 h-5" />,
  "Estilo de Vida": <Activity className="w-5 h-5" />,
  "Rotina": <Timer className="w-5 h-5" />,
  "Contexto": <Brain className="w-5 h-5" />
}

const optionIcons: Record<string, React.ReactNode> = {
  // Objetivos
  "Perder peso de forma saudável": <TrendingDown className="w-5 h-5 text-blue-500" />,
  "Ganhar massa muscular": <Dumbbell className="w-5 h-5 text-green-500" />,
  "Manter peso e saúde": <Scale className="w-5 h-5 text-yellow-500" />,
  "Melhorar performance esportiva": <Flame className="w-5 h-5 text-orange-500" />,
  "Controlar condição de saúde": <Shield className="w-5 h-5 text-purple-500" />,
  "Aumentar energia e disposição": <Zap className="w-5 h-5 text-amber-500" />,
  
  // Nível de atividade
  "Sedentário (pouco ou nenhum exercício)": <Circle className="w-5 h-5 text-gray-400" />,
  "Levemente ativo (1-3x por semana)": <Activity className="w-5 h-5 text-yellow-400" />,
  "Moderadamente ativo (3-5x por semana)": <Activity className="w-5 h-5 text-orange-500" />,
  "Muito ativo (6-7x por semana)": <Dumbbell className="w-5 h-5 text-red-500" />,
  "Atleta (treino intenso diário)": <Flame className="w-5 h-5 text-purple-600" />,
  
  // Restrições
  "Nenhuma restrição": <Check className="w-5 h-5 text-green-500" />,
  "Vegetariano": <Leaf className="w-5 h-5 text-green-500" />,
  "Vegano": <Leaf className="w-5 h-5 text-green-600" />,
  "Sem lactose": <Milk className="w-5 h-5 text-blue-400" />,
  "Sem glúten": <Wheat className="w-5 h-5 text-orange-400" />,
  "Low carb": <TrendingDown className="w-5 h-5 text-blue-500" />,
  "Cetogênica": <Flame className="w-5 h-5 text-red-500" />,
  "Paleo": <Beef className="w-5 h-5 text-amber-600" />,
  "Mediterrânea": <Fish className="w-5 h-5 text-cyan-500" />,
  
  // Refeições
  "Café da manhã": <Coffee className="w-5 h-5 text-amber-600" />,
  "Lanche da manhã": <Cookie className="w-5 h-5 text-yellow-500" />,
  "Almoço": <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
  "Lanche da tarde": <Apple className="w-5 h-5 text-red-400" />,
  "Jantar": <Soup className="w-5 h-5 text-indigo-500" />,
  "Ceia": <Cake className="w-5 h-5 text-pink-500" />,
  
  // Tempo
  "Menos de 15 minutos": <Timer className="w-5 h-5 text-red-500" />,
  "15-30 minutos": <Timer className="w-5 h-5 text-orange-500" />,
  "30-45 minutos": <Timer className="w-5 h-5 text-yellow-500" />,
  "45-60 minutos": <Timer className="w-5 h-5 text-green-500" />,
  "Mais de 1 hora": <Timer className="w-5 h-5 text-blue-500" />,
  
  // Orçamento
  "Econômico (até R$15/refeição)": <DollarSign className="w-5 h-5 text-green-500" />,
  "Moderado (R$15-30/refeição)": <DollarSign className="w-5 h-5 text-yellow-500" />,
  "Confortável (R$30-50/refeição)": <DollarSign className="w-5 h-5 text-orange-500" />,
  "Premium (acima de R$50/refeição)": <DollarSign className="w-5 h-5 text-purple-500" />,
  
  // Habilidade
  "Iniciante (receitas simples)": <ChefHat className="w-5 h-5 text-green-500" />,
  "Intermediário (receitas moderadas)": <ChefHat className="w-5 h-5 text-yellow-500" />,
  "Avançado (receitas complexas)": <ChefHat className="w-5 h-5 text-orange-500" />,
  "Chef (qualquer complexidade)": <ChefHat className="w-5 h-5 text-red-500" />,
  
  // Ingredientes
  "Frango": <Egg className="w-5 h-5 text-yellow-600" />,
  "Carne vermelha": <Beef className="w-5 h-5 text-red-600" />,
  "Peixes": <Fish className="w-5 h-5 text-blue-500" />,
  "Ovos": <Egg className="w-5 h-5 text-yellow-400" />,
  "Legumes": <Leaf className="w-5 h-5 text-green-500" />,
  "Frutas": <Apple className="w-5 h-5 text-red-400" />,
  "Grãos integrais": <Wheat className="w-5 h-5 text-amber-500" />,
  "Laticínios": <Milk className="w-5 h-5 text-blue-300" />,
  "Oleaginosas": <Circle className="w-5 h-5 text-amber-600" />,
  "Massas": <Wheat className="w-5 h-5 text-orange-400" />,
}

export function QuizCard({
  step,
  totalSteps,
  question,
  category,
  type,
  options = [],
  value,
  onChange,
  onNext,
  onPrevious,
  placeholder,
  fields,
  additionalDetails = "",
  onAdditionalDetailsChange,
  analysis
}: QuizCardProps) {
  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValues = Array.isArray(value) ? value : []
    if (checked) {
      onChange([...currentValues, option])
    } else {
      onChange(currentValues.filter(v => v !== option))
    }
  }

  const handleCombinedChange = (key: string, val: string) => {
    const currentValues = typeof value === 'object' && !Array.isArray(value) ? value : {}
    onChange({ ...currentValues, [key]: val })
  }

  const progress = (step / totalSteps) * 100

  const isNextDisabled = () => {
    if (type === 'single') return !value
    if (type === 'multiple') return !Array.isArray(value) || value.length === 0
    if (type === 'text' || type === 'textarea') return !value || (typeof value === 'string' && value.trim() === '')
    if (type === 'combined' && fields) {
      const vals = value as Record<string, string>
      return fields.some(field => !vals[field.key] || vals[field.key].trim() === '')
    }
    return false
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md">
      <CardHeader className="space-y-4 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 text-white">
              {categoryIcons[category]}
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-orange-500 block">
                {category}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Etapa {step} de {totalSteps}
              </span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="relative w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <CardTitle className="text-2xl sm:text-3xl font-bold leading-tight text-gray-900 dark:text-white">
          {question}
        </CardTitle>
        
        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
          {type === 'multiple' && "Selecione todas as opções que se aplicam"}
          {type === 'single' && "Escolha a opção que melhor descreve sua situação"}
          {type === 'text' && "Digite sua resposta de forma clara"}
          {type === 'textarea' && "Quanto mais detalhes você fornecer, melhor será seu cardápio"}
          {type === 'combined' && "Preencha todos os campos para análise completa"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Análise em tempo real */}
        {analysis && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-2xl p-5 border-2 border-blue-200 dark:border-blue-800 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-500 text-white flex-shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-2">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Análise da IA
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                  {analysis}
                </p>
              </div>
            </div>
          </div>
        )}

        {type === 'single' && (
          <RadioGroup value={value as string} onValueChange={onChange}>
            <div className="grid grid-cols-1 gap-3">
              {options.map((option) => (
                <div 
                  key={option} 
                  className="relative group"
                >
                  <div className="flex items-center space-x-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-950/20 dark:hover:to-red-950/20 transition-all duration-300 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-orange-50 has-[:checked]:to-red-50 dark:has-[:checked]:from-orange-950/30 dark:has-[:checked]:to-red-950/30 has-[:checked]:shadow-lg">
                    <RadioGroupItem 
                      value={option} 
                      id={option} 
                      className="border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                    />
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-shrink-0 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm group-hover:shadow-md transition-shadow">
                        {optionIcons[option] || <Circle className="w-5 h-5 text-gray-400" />}
                      </div>
                      <Label 
                        htmlFor={option} 
                        className="flex-1 cursor-pointer text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                      >
                        {option}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}

        {type === 'multiple' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {options.map((option) => (
              <div 
                key={option} 
                className="relative group"
              >
                <div className="flex items-center space-x-4 p-4 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-400 dark:hover:border-orange-600 hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-red-50/50 dark:hover:from-orange-950/20 dark:hover:to-red-950/20 transition-all duration-300 cursor-pointer has-[:checked]:border-orange-500 has-[:checked]:bg-gradient-to-r has-[:checked]:from-orange-50 has-[:checked]:to-red-50 dark:has-[:checked]:from-orange-950/30 dark:has-[:checked]:to-red-950/30 has-[:checked]:shadow-md">
                  <Checkbox
                    id={option}
                    checked={Array.isArray(value) && value.includes(option)}
                    onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                    className="border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0 p-1.5 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      {optionIcons[option] || <Circle className="w-4 h-4 text-gray-400" />}
                    </div>
                    <Label 
                      htmlFor={option} 
                      className="flex-1 cursor-pointer text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors"
                    >
                      {option}
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {type === 'text' && (
          <Input
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Digite aqui..."}
            className="text-base p-5 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-2xl shadow-sm focus:shadow-md transition-all"
          />
        )}

        {type === 'textarea' && (
          <Textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Descreva aqui..."}
            rows={6}
            className="text-base p-5 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-2xl resize-none shadow-sm focus:shadow-md transition-all"
          />
        )}

        {type === 'combined' && fields && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={(value as Record<string, string>)[field.key] || ''}
                  onChange={(e) => handleCombinedChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="text-base p-4 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl shadow-sm focus:shadow-md transition-all"
                />
              </div>
            ))}
          </div>
        )}

        {/* Campo de detalhes adicionais */}
        {onAdditionalDetailsChange && (
          <div className="space-y-3 pt-4 border-t-2 border-dashed border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <Info className="w-4 h-4 text-orange-500" />
              <Label className="text-sm font-semibold">
                Detalhes adicionais (opcional)
              </Label>
            </div>
            <div className="relative">
              <Textarea
                value={additionalDetails}
                onChange={(e) => onAdditionalDetailsChange(e.target.value)}
                placeholder="Adicione informações extras que possam ajudar a personalizar ainda mais seu cardápio... Você também pode usar o microfone para falar!"
                rows={3}
                className="text-sm p-4 pr-12 border-2 border-gray-200 dark:border-gray-700 focus:border-orange-400 dark:focus:border-orange-600 rounded-xl resize-none bg-gray-50 dark:bg-gray-800/50 transition-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 bottom-2 h-8 w-8 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 text-orange-500"
                title="Usar microfone (em breve)"
              >
                <Mic className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-6 gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={step === 1}
            className="gap-2 px-6 py-6 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 rounded-xl font-semibold transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Anterior
          </Button>
          
          <Button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="gap-2 px-8 py-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white font-bold shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-base"
          >
            {step === totalSteps ? (
              <>
                <Sparkles className="w-5 h-5" />
                Gerar Cardápio Personalizado
                <Sparkles className="w-5 h-5" />
              </>
            ) : (
              <>
                Próxima
                <ChevronRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
