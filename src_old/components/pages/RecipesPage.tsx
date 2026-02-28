import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Search, Plus, Clock, ChefHat, Flame } from 'lucide-react';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Separator } from '../ui/separator';

const mockRecipes = [
  {
    id: 1,
    name: 'Cappuccino',
    category: 'Coffee',
    difficulty: 'Easy',
    prepTime: '5 min',
    servings: 1,
    image: '☕',
    ingredients: [
      { item: 'Espresso', amount: '2 shots' },
      { item: 'Milk', amount: '200ml' },
    ],
    instructions: [
      'Pull 2 shots of espresso',
      'Steam milk to 65°C',
      'Pour into cup',
      'Add foam on top'
    ],
    tips: 'Use fresh milk for best foam'
  },
];

export function RecipesPage() {
  const [recipes] = useState(mockRecipes);
  const [searchQuery, setSearchQuery] = useState('');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['All', ...Array.from(new Set(recipes.map(r => r.category)))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-800">Recipes</h1>
          <p className="text-gray-500">Manage your beverage and food recipes</p>
        </div>
        <Button className="gap-2 bg-amber-600 hover:bg-amber-700">
          <Plus className="w-4 h-4" />
          Add Recipe
        </Button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Total Recipes</p>
            <h2 className="mt-1 text-gray-900">{recipes.length}</h2>
            <p className="text-gray-500 mt-1">Available recipes</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Easy Recipes</p>
            <h2 className="mt-1 text-gray-900">{recipes.filter(r => r.difficulty === 'Easy').length}</h2>
            <p className="text-emerald-600 mt-1">Quick to prepare</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200">
          <CardContent className="pt-5">
            <p className="text-gray-500">Avg. Prep Time</p>
            <h2 className="mt-1 text-gray-900">5 min</h2>
            <p className="text-gray-500 mt-1">Average time</p>
          </CardContent>
        </Card>
      </div>

      {/* Recipes */}
      <Card className="border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gray-700">Recipes</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search recipes..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="All" className="w-full">
            <TabsList className="mb-6">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category}>
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
            {categories.map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredRecipes
                    .filter(recipe => category === 'All' || recipe.category === category)
                    .map((recipe) => (
                      <Dialog key={recipe.id}>
                        <DialogTrigger asChild>
                          <Card className="border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                            <CardContent className="pt-6">
                              <div className="text-3xl mb-3">{recipe.image}</div>
                              <h4 className="text-gray-900 mb-2">{recipe.name}</h4>
                              <div className="flex gap-2 mb-3 flex-wrap">
                                <Badge variant="secondary" className={getDifficultyColor(recipe.difficulty)}>
                                  {recipe.difficulty}
                                </Badge>
                                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {recipe.prepTime}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                              </p>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <span className="text-3xl">{recipe.image}</span>
                              {recipe.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <Badge className={getDifficultyColor(recipe.difficulty)}>
                                {recipe.difficulty}
                              </Badge>
                              <Badge className="bg-blue-100 text-blue-700">
                                <Clock className="w-3 h-3 mr-1" />
                                {recipe.prepTime}
                              </Badge>
                              <Badge className="bg-purple-100 text-purple-700">
                                {recipe.servings} serving{recipe.servings > 1 ? 's' : ''}
                              </Badge>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <ChefHat className="w-4 h-4" />
                                Ingredients
                              </h3>
                              <ul className="space-y-2">
                                {recipe.ingredients.map((ing, index) => (
                                  <li key={index} className="text-gray-700 flex justify-between">
                                    <span>{ing.item}</span>
                                    <span className="text-gray-500">{ing.amount}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <Separator />

                            <div>
                              <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Flame className="w-4 h-4" />
                                Instructions
                              </h3>
                              <ol className="space-y-2 list-decimal list-inside">
                                {recipe.instructions.map((instruction, index) => (
                                  <li key={index} className="text-gray-700">{instruction}</li>
                                ))}
                              </ol>
                            </div>

                            {recipe.tips && (
                              <>
                                <Separator />
                                <div>
                                  <h3 className="font-semibold mb-2">💡 Tips</h3>
                                  <p className="text-gray-700">{recipe.tips}</p>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    ))}
                </div>
                {filteredRecipes.filter(recipe => category === 'All' || recipe.category === category).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No recipes found</p>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
