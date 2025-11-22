"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ChefHat, DollarSign, Flame } from "lucide-react"
import type { Dish } from "@/lib/types"

interface DishCardProps {
  dish: Dish
}

export function DishCard({ dish }: DishCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105">
      <div className="h-48 bg-gradient-to-br from-orange-100 to-pink-100 dark:from-orange-950 dark:to-pink-950 flex items-center justify-center">
        <ChefHat className="w-20 h-20 text-orange-400 opacity-50" />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl">{dish.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {dish.cuisine_type}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2">{dish.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{dish.preparation_time}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <span>{dish.estimated_price}</span>
          </div>
          <div className="flex items-center gap-2">
            <ChefHat className="w-4 h-4 text-muted-foreground" />
            <span>{dish.difficulty}</span>
          </div>
          {dish.calories && (
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-muted-foreground" />
              <span>{dish.calories} cal</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Ingredientes principais:</h4>
          <div className="flex flex-wrap gap-2">
            {dish.ingredients.slice(0, 5).map((ingredient, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {ingredient}
              </Badge>
            ))}
            {dish.ingredients.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{dish.ingredients.length - 5} mais
              </Badge>
            )}
          </div>
        </div>

        {dish.dietary_info.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {dish.dietary_info.map((info, index) => (
              <Badge key={index} className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                {info}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
