import React, { useState, useEffect } from 'react'
import { X, Plus, Search } from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { categoryService, defaultCategories } from '../../services/categories'

export interface CategorySelectorProps {
  selectedCategories: string[]
  onSelect: (categories: string[]) => void
  placeholder?: string
}

export function CategorySelector({ 
  selectedCategories, 
  onSelect,
  placeholder = 'Search categories...'
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryDesc, setNewCategoryDesc] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const data = await categoryService.getCategories()
    setCategories(data)
  }

  const toggleCategory = (id: string) => {
    if (selectedCategories.includes(id)) {
      onSelect(selectedCategories.filter(c => c !== id))
    } else {
      onSelect([...selectedCategories, id])
    }
  }

  const addCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const newCategory = await categoryService.addCategory(
        newCategoryName,
        newCategoryDesc || undefined
      )
      
      await fetchCategories()
      setShowAddModal(false)
      setNewCategoryName('')
      setNewCategoryDesc('')
      
      onSelect([...selectedCategories, newCategory.id])
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="w-4 h-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 text-sm"
        />
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Category
        </Button>
      </div>

      <div className="space-y-2">
        {selectedCategories.map(categoryId => {
          const category = categories.find(c => c.id === categoryId) || 
                         defaultCategories.find(c => c.id === categoryId)
          if (!category) return null

          return (
            <div key={categoryId} className="flex items-center gap-2">
              <Badge variant="secondary" className="py-0 px-2">
                {category.name}
              </Badge>
              <button
                onClick={() => toggleCategory(categoryId)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )
        })}
      </div>

      {filteredCategories.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase">Categories</p>
          {filteredCategories.map(category => {
            const isSelected = selectedCategories.includes(category.id)
            
            return (
              <div
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  isSelected 
                    ? 'bg-primary/10' 
                    : 'hover:bg-accent/50'
                }`}
              >
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isSelected ? 'text-primary' : ''}`}>
                    {category.name}
                  </span>
                  {category.description && (
                    <span className="text-xs text-muted-foreground">
                      {category.description}
                    </span>
                  )}
                </div>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                  isSelected 
                    ? 'bg-primary border-primary' 
                    : 'border-input'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Add Custom Category</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Category Name</label>
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="e.g., African Fashion Brands"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Description (Optional)</label>
                <textarea
                  className="w-full min-h-[80px] p-2 rounded-lg border bg-background text-sm"
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  placeholder="Description of this category..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={addCategory}>
                Add Category
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
