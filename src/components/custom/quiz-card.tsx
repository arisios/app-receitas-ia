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
  X,
  Plus,
  Minus,
  ArrowUp,
  ArrowDown,
  Sun,
  Moon,
  Star,
  Clock,
  Calendar,
  Home,
  Users,
  Target,
  TrendingDown,
  TrendingUp,
  Activity,
  Dumbbell,
  Flame,
  Droplet,
  Apple,
  Leaf,
  Fish,
  Beef,
  Egg,
  Milk,
  Wheat,
  Cookie,
  Salad,
  Pizza,
  Coffee,
  Soup,
  UtensilsCrossed,
  ChefHat,
  Timer,
  DollarSign,
  Scale,
  Ruler,
  Cake
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
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Objetivos": <Target className="w-5 h-5" />,
  "Perfil": <User className="w-5 h-5" />,
  "Saúde": <Heart className="w-5 h-5" />,
  "Preferências": <Star className="w-5 h-5" />,
  "Estilo de Vida": <Activity className="w-5 h-5" />,
  "Logística": <Clock className="w-5 h-5" />,
  "Motivação": <Flame className="w-5 h-5" />
}

// Mapeamento de ícones para cada opção específica
const optionIcons: Record<string, React.ReactNode> = {
  // Objetivos
  "Perder peso": <TrendingDown className="w-5 h-5 text-blue-500" />,
  "Ganhar massa muscular": <Dumbbell className="w-5 h-5 text-green-500" />,
  "Manter peso atual": <Scale className="w-5 h-5 text-yellow-500" />,
  "Melhorar saúde geral": <Heart className="w-5 h-5 text-red-500" />,
  "Controlar condição médica": <Shield className="w-5 h-5 text-purple-500" />,
  "Aumentar energia": <Zap className="w-5 h-5 text-orange-500" />,
  
  // Gênero
  "Masculino": <User className="w-5 h-5 text-blue-500" />,
  "Feminino": <User className="w-5 h-5 text-pink-500" />,
  "Prefiro não informar": <User className="w-5 h-5 text-gray-500" />,
  
  // Nível de atividade
  "Sedentário": <Moon className="w-5 h-5 text-gray-500" />,
  "Levemente ativo": <Sun className="w-5 h-5 text-yellow-400" />,
  "Moderadamente ativo": <Activity className="w-5 h-5 text-orange-500" />,
  "Muito ativo": <Dumbbell className="w-5 h-5 text-red-500" />,
  "Extremamente ativo": <Flame className="w-5 h-5 text-purple-600" />,
  
  // Restrições alimentares
  "Vegetariano": <Leaf className="w-5 h-5 text-green-500" />,
  "Vegano": <Leaf className="w-5 h-5 text-green-600" />,
  "Sem lactose": <Milk className="w-5 h-5 text-blue-400" />,
  "Sem glúten": <Wheat className="w-5 h-5 text-orange-400" />,
  "Low carb": <TrendingDown className="w-5 h-5 text-blue-500" />,
  "Cetogênica": <Flame className="w-5 h-5 text-red-500" />,
  "Jejum intermitente": <Clock className="w-5 h-5 text-purple-500" />,
  "Dieta mediterrânea": <Fish className="w-5 h-5 text-cyan-500" />,
  "Kosher": <Shield className="w-5 h-5 text-blue-700" />,
  "Halal": <Shield className="w-5 h-5 text-green-700" />,
  "Paleo": <Beef className="w-5 h-5 text-amber-600" />,
  "Sem açúcar": <X className="w-5 h-5 text-red-500" />,
  "Nenhuma": <Check className="w-5 h-5 text-green-500" />,
  
  // Cozinhas
  "Brasileira": <Coffee className="w-5 h-5 text-green-600" />,
  "Italiana": <Pizza className="w-5 h-5 text-red-500" />,
  "Japonesa": <Fish className="w-5 h-5 text-red-600" />,
  "Mexicana": <Flame className="w-5 h-5 text-orange-500" />,
  "Árabe": <Star className="w-5 h-5 text-yellow-600" />,
  "Francesa": <ChefHat className="w-5 h-5 text-blue-500" />,
  "Chinesa": <Soup className="w-5 h-5 text-red-500" />,
  "Indiana": <Flame className="w-5 h-5 text-orange-600" />,
  "Tailandesa": <Flame className="w-5 h-5 text-red-400" />,
  "Mediterrânea": <Fish className="w-5 h-5 text-cyan-600" />,
  "Americana": <Cookie className="w-5 h-5 text-yellow-500" />,
  "Coreana": <Flame className="w-5 h-5 text-red-600" />,
  
  // Tempero
  "Suave": <Droplet className="w-5 h-5 text-blue-400" />,
  "Moderado": <Flame className="w-5 h-5 text-orange-400" />,
  "Picante": <Flame className="w-5 h-5 text-red-500" />,
  "Muito picante": <Flame className="w-5 h-5 text-red-600" />,
  
  // Ingredientes
  "Frango": <Egg className="w-5 h-5 text-yellow-600" />,
  "Carne bovina": <Beef className="w-5 h-5 text-red-600" />,
  "Carne suína": <Beef className="w-5 h-5 text-pink-500" />,
  "Peixes": <Fish className="w-5 h-5 text-blue-500" />,
  "Frutos do mar": <Fish className="w-5 h-5 text-cyan-500" />,
  "Ovos": <Egg className="w-5 h-5 text-yellow-400" />,
  "Queijos": <Milk className="w-5 h-5 text-yellow-500" />,
  "Iogurte": <Milk className="w-5 h-5 text-blue-300" />,
  "Massas": <Wheat className="w-5 h-5 text-amber-500" />,
  "Arroz": <Wheat className="w-5 h-5 text-amber-400" />,
  "Batata": <Circle className="w-5 h-5 text-amber-600" />,
  "Batata-doce": <Circle className="w-5 h-5 text-orange-500" />,
  "Feijão": <Circle className="w-5 h-5 text-amber-700" />,
  "Vegetais verdes": <Leaf className="w-5 h-5 text-green-500" />,
  "Frutas": <Apple className="w-5 h-5 text-red-400" />,
  "Castanhas": <Circle className="w-5 h-5 text-amber-600" />,
  "Abacate": <Leaf className="w-5 h-5 text-green-600" />,
  "Cogumelos": <Circle className="w-5 h-5 text-gray-500" />,
  
  // Orçamento
  "Econômico": <DollarSign className="w-5 h-5 text-green-500" />,
  "Moderado": <DollarSign className="w-5 h-5 text-yellow-500" />,
  "Confortável": <DollarSign className="w-5 h-5 text-orange-500" />,
  "Premium": <Star className="w-5 h-5 text-purple-500" />,
  
  // Tempo
  "Menos de 20 minutos": <Timer className="w-5 h-5 text-red-500" />,
  "20-40 minutos": <Timer className="w-5 h-5 text-orange-500" />,
  "40-60 minutos": <Timer className="w-5 h-5 text-yellow-500" />,
  "Mais de 1 hora": <Timer className="w-5 h-5 text-green-500" />,
  
  // Tipo de refeição
  "Café da manhã": <Coffee className="w-5 h-5 text-amber-600" />,
  "Almoço": <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
  "Jantar": <Moon className="w-5 h-5 text-indigo-500" />,
  "Lanche": <Cookie className="w-5 h-5 text-yellow-500" />,
  "Sobremesa": <Cake className="w-5 h-5 text-pink-500" />,
  "Refeição completa": <Salad className="w-5 h-5 text-green-500" />,
  
  // Pessoas
  "1 pessoa": <User className="w-5 h-5 text-blue-500" />,
  "2 pessoas": <Users className="w-5 h-5 text-green-500" />,
  "3-4 pessoas": <Users className="w-5 h-5 text-orange-500" />,
  "5-6 pessoas": <Users className="w-5 h-5 text-red-500" />,
  "Mais de 6 pessoas": <Users className="w-5 h-5 text-purple-500" />,
  
  // Motivação
  "Saúde e bem-estar": <Heart className="w-5 h-5 text-red-500" />,
  "Estética": <Star className="w-5 h-5 text-purple-500" />,
  "Performance": <Dumbbell className="w-5 h-5 text-orange-500" />,
  "Prevenção": <Shield className="w-5 h-5 text-blue-500" />,
  "Qualidade de vida": <Sun className="w-5 h-5 text-yellow-500" />,
  "Recomendação médica": <AlertTriangle className="w-5 h-5 text-red-600" />
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
  fields
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
    <Card className="w-full max-w-3xl mx-auto shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-500">
            {categoryIcons[category]}
            <span className="text-sm font-semibold uppercase tracking-wide">
              {category}
            </span>
          </div>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {step} / {totalSteps}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-orange-500">
              {Math.round(progress)}% completo
            </span>
          </div>
        </div>

        <CardTitle className="text-2xl sm:text-3xl leading-tight text-gray-900 dark:text-white">
          {question}
        </CardTitle>
        
        <CardDescription className="text-base text-gray-600 dark:text-gray-400">
          {type === 'multiple' && "Selecione todas as opções que se aplicam"}
          {type === 'single' && "Escolha a opção que melhor descreve você"}
          {type === 'text' && "Digite sua resposta"}
          {type === 'textarea' && "Descreva com detalhes (quanto mais informações, melhor o cardápio)"}
          {type === 'combined' && "Preencha todos os campos"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {type === 'single' && (
          <RadioGroup value={value as string} onValueChange={onChange}>
            <div className="grid grid-cols-1 gap-3">
              {options.map((option) => (
                <div 
                  key={option} 
                  className="relative flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all duration-200 cursor-pointer group"
                >
                  <RadioGroupItem 
                    value={option} 
                    id={option} 
                    className="border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex-shrink-0">
                      {optionIcons[option] || <Circle className="w-5 h-5 text-gray-400" />}
                    </div>
                    <Label 
                      htmlFor={option} 
                      className="flex-1 cursor-pointer text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                    >
                      {option}
                    </Label>
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
                className="relative flex items-center space-x-3 p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 transition-all duration-200 cursor-pointer group"
              >
                <Checkbox
                  id={option}
                  checked={Array.isArray(value) && value.includes(option)}
                  onCheckedChange={(checked) => handleCheckboxChange(option, checked as boolean)}
                  className="border-2 border-gray-300 dark:border-gray-600 data-[state=checked]:border-orange-500 data-[state=checked]:bg-orange-500"
                />
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-shrink-0">
                    {optionIcons[option] || <Circle className="w-5 h-5 text-gray-400" />}
                  </div>
                  <Label 
                    htmlFor={option} 
                    className="flex-1 cursor-pointer text-base font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white"
                  >
                    {option}
                  </Label>
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
            className="text-base p-4 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl"
          />
        )}

        {type === 'textarea' && (
          <Textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Descreva aqui..."}
            rows={6}
            className="text-base p-4 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl resize-none"
          />
        )}

        {type === 'combined' && fields && (
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={field.key} className="text-base font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                </Label>
                <Input
                  id={field.key}
                  type={field.type}
                  value={(value as Record<string, string>)[field.key] || ''}
                  onChange={(e) => handleCombinedChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="text-base p-4 border-2 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl"
                />
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between pt-6 gap-4">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={step === 1}
            className="gap-2 px-6 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          
          <Button
            onClick={onNext}
            disabled={isNextDisabled()}
            className="gap-2 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {step === totalSteps ? (
              <>
                Gerar Cardápio
                <Star className="w-4 h-4" />
              </>
            ) : (
              <>
                Próxima
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
