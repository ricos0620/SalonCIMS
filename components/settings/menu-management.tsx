"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Pencil, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"

interface Menu {
  id: string
  name: string
  category: string
  price: string
  duration: string
  description?: string
  order: number
}

interface Category {
  id: string
  name: string
  order: number
}

const setLocalStorage = (key: string, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function MenuManagement() {
  const [activeTab, setActiveTab] = useState("menus")
  const defaultMenus: Menu[] = []
  const defaultCategories: Category[] = []

  const [menuList, _setMenuList] = useState<Menu[]>([])
  const [categories, _setCategories] = useState<Category[]>([])

  const setMenuList = (menus: Menu[]) => {
    _setMenuList(menus)
    setLocalStorage("salon_menus", menus)
  }
  const setCategories = (cats: Category[]) => {
    _setCategories(cats)
    setLocalStorage("salon_menu_categories", cats)
  }

  useEffect(() => {
    const fetchMenus = async () => {
      const { data, error } = await supabase.from("menus").select("*").order("order")
      if (!error && data) {
        _setMenuList(data)
        setLocalStorage("salon_menus", data)
      } else {
        const menuData = localStorage.getItem("salon_menus")
        _setMenuList(menuData ? JSON.parse(menuData) : defaultMenus)
      }
    }
    fetchMenus()

    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("*").order("order")
      if (!error && data) {
        _setCategories(data)
        setLocalStorage("salon_menu_categories", data)
      } else {
        const catData = localStorage.getItem("salon_menu_categories")
        _setCategories(catData ? JSON.parse(catData) : defaultCategories)
      }
    }
    fetchCategories()
  }, [])

  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false)
  const [isDeleteMenuDialogOpen, setIsDeleteMenuDialogOpen] = useState(false)
  const [currentMenu, setCurrentMenu] = useState<Menu | null>(null)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isDeleteCategoryDialogOpen, setIsDeleteCategoryDialogOpen] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null)
  const [menuForm, setMenuForm] = useState({
    name: "",
    category: "",
    price: "",
    duration: "",
    description: "",
  })
  const [categoryForm, setCategoryForm] = useState({
    name: "",
  })
  const [menuErrors, setMenuErrors] = useState<Record<string, string>>({})
  const [categoryErrors, setCategoryErrors] = useState<Record<string, string>>({})

  const openAddMenuDialog = () => {
    setMenuForm({
      name: "",
      category: "",
      price: "",
      duration: "",
      description: "",
    })
    setMenuErrors({})
    setCurrentMenu(null)
    setIsMenuDialogOpen(true)
  }

  const openEditMenuDialog = (menu: Menu) => {
    setMenuForm({
      name: menu.name,
      category: menu.category,
      price: menu.price,
      duration: menu.duration,
      description: menu.description || "",
    })
    setMenuErrors({})
    setCurrentMenu(menu)
    setIsMenuDialogOpen(true)
  }

  const openDeleteMenuDialog = (menu: Menu) => {
    setCurrentMenu(menu)
    setIsDeleteMenuDialogOpen(true)
  }

  const openAddCategoryDialog = () => {
    setCategoryForm({ name: "" })
    setCategoryErrors({})
    setCurrentCategory(null)
    setIsCategoryDialogOpen(true)
  }

  const openEditCategoryDialog = (category: Category) => {
    setCategoryForm({ name: category.name })
    setCategoryErrors({})
    setCurrentCategory(category)
    setIsCategoryDialogOpen(true)
  }

  const openDeleteCategoryDialog = (category: Category) => {
    setCurrentCategory(category)
    setIsDeleteCategoryDialogOpen(true)
  }

  const validateMenuForm = () => {
    const errors: Record<string, string> = {}

    if (!menuForm.name.trim()) errors.name = "メニュー名は必須です"
    if (!menuForm.category.trim()) errors.category = "カテゴリーは必須です"
    if (!menuForm.price.trim()) errors.price = "料金は必須です"
    else if (isNaN(Number(menuForm.price)) || Number(menuForm.price) <= 0)
      errors.price = "正しい料金を入力してください"
    if (!menuForm.duration.trim()) errors.duration = "所要時間は必須です"
    else if (isNaN(Number(menuForm.duration)) || Number(menuForm.duration) <= 0)
      errors.duration = "正しい所要時間を入力してください"

    setMenuErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateCategoryForm = () => {
    const errors: Record<string, string> = {}
    if (!categoryForm.name.trim()) errors.name = "カテゴリー名は必須です"
    else if (
      categories.some(
        (cat) =>
          cat.name === categoryForm.name &&
          (!currentCategory || cat.id !== currentCategory.id)
      )
    )
      errors.name = "同名のカテゴリーが既に存在します"
    setCategoryErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 並び替え
  const moveMenuUp = (id: string) => {
    const sortedMenus = [...menuList].sort((a, b) => a.order - b.order)
    const idx = sortedMenus.findIndex(m => m.id === id)
    if (idx <= 0) return

    const prev = sortedMenus[idx - 1]
    const curr = sortedMenus[idx]

    sortedMenus[idx - 1] = { ...curr, order: prev.order }
    sortedMenus[idx] = { ...prev, order: curr.order }

    setMenuList(sortedMenus)
    supabase.from("menus").update({ order: prev.order }).eq("id", curr.id)
    supabase.from("menus").update({ order: curr.order }).eq("id", prev.id)
  }
  const moveMenuDown = (id: string) => {
    const sortedMenus = [...menuList].sort((a, b) => a.order - b.order)
    const idx = sortedMenus.findIndex(m => m.id === id)
    if (idx === -1 || idx >= sortedMenus.length - 1) return

    const next = sortedMenus[idx + 1]
    const curr = sortedMenus[idx]

    sortedMenus[idx + 1] = { ...curr, order: next.order }
    sortedMenus[idx] = { ...next, order: curr.order }

    setMenuList(sortedMenus)
    supabase.from("menus").update({ order: next.order }).eq("id", curr.id)
    supabase.from("menus").update({ order: curr.order }).eq("id", next.id)
  }
  const moveCategoryUp = (id: string) => {
    const sortedCats = [...categories].sort((a, b) => a.order - b.order)
    const idx = sortedCats.findIndex(c => c.id === id)
    if (idx <= 0) return

    const prev = sortedCats[idx - 1]
    const curr = sortedCats[idx]

    sortedCats[idx - 1] = { ...curr, order: prev.order }
    sortedCats[idx] = { ...prev, order: curr.order }

    setCategories(sortedCats)
    supabase.from("categories").update({ order: prev.order }).eq("id", curr.id)
    supabase.from("categories").update({ order: curr.order }).eq("id", prev.id)
  }
  const moveCategoryDown = (id: string) => {
    const sortedCats = [...categories].sort((a, b) => a.order - b.order)
    const idx = sortedCats.findIndex(c => c.id === id)
    if (idx === -1 || idx >= sortedCats.length - 1) return

    const next = sortedCats[idx + 1]
    const curr = sortedCats[idx]

    sortedCats[idx + 1] = { ...curr, order: next.order }
    sortedCats[idx] = { ...next, order: curr.order }

    setCategories(sortedCats)
    supabase.from("categories").update({ order: next.order }).eq("id", curr.id)
    supabase.from("categories").update({ order: curr.order }).eq("id", next.id)
  }

  // メニュー追加・編集
  const handleMenuSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateMenuForm()) return

    try {
      if (currentMenu) {
        const updatedMenuList = menuList.map((menu) =>
          menu.id === currentMenu.id ? { ...menuForm, id: menu.id, order: menu.order } : menu,
        )
        setMenuList(updatedMenuList)

        const { error: updateError } = await supabase
          .from("menus")
          .update({
            name: menuForm.name,
            category: menuForm.category,
            price: menuForm.price,
            duration: menuForm.duration,
            description: menuForm.description,
            order: currentMenu.order,
          })
          .eq("id", currentMenu.id)
        if (updateError) {
          toast({ title: "エラー", description: updateError.message, variant: "destructive" })
        } else {
          toast({ title: "メニューを更新しました", description: `${menuForm.name}を更新しました。` })
        }
      } else {
        // ←修正版（supabaseにinsert後、返ってきた値をsetMenuList）
        const maxOrder = menuList.length > 0 ? Math.max(...menuList.map((m) => m.order)) : 0
        const newMenu: Omit<Menu, "id"> = {
          name: menuForm.name,
          category: menuForm.category,
          price: menuForm.price,
          duration: menuForm.duration,
          description: menuForm.description,
          order: maxOrder + 1,
        }

        const { data, error: insertError } = await supabase
          .from("menus")
          .insert([newMenu])
          .select()
          .single()

        if (insertError || !data) {
          toast({ title: "エラー", description: insertError?.message ?? "登録に失敗しました", variant: "destructive" })
        } else {
          setMenuList([...menuList, data])
          toast({ title: "メニューを追加しました", description: `${data.name}を追加しました。` })
        }
      }
      setIsMenuDialogOpen(false)
    } catch (error: any) {
      toast({ title: "エラー", description: error?.message ?? "メニューの保存に失敗しました", variant: "destructive" })
    }
  }

  // メニュー削除
  const handleDeleteMenu = async () => {
    if (currentMenu) {
      const updatedMenuList = menuList.filter((menu) => menu.id !== currentMenu.id)
      setMenuList(updatedMenuList)
      const { error: deleteError } = await supabase.from("menus").delete().eq("id", currentMenu.id)
      if (deleteError) {
        toast({ title: "エラー", description: deleteError.message, variant: "destructive" })
      } else {
        toast({ title: "メニューを削除しました", description: `${currentMenu.name}を削除しました。` })
      }
      setIsDeleteMenuDialogOpen(false)
      setCurrentMenu(null)
    }
  }

  // カテゴリ追加・編集
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateCategoryForm()) return

    try {
      if (currentCategory) {
        const updatedCatList = categories.map((cat) =>
          cat.id === currentCategory.id ? { ...cat, name: categoryForm.name } : cat,
        )
        setCategories(updatedCatList)
        const { error: updateError } = await supabase
          .from("categories")
          .update({ name: categoryForm.name })
          .eq("id", currentCategory.id)
        if (updateError) {
          toast({ title: "エラー", description: updateError.message, variant: "destructive" })
        } else {
          toast({ title: "カテゴリーを更新しました", description: `${categoryForm.name}を更新しました。` })
        }
      } else {
        const maxOrder = categories.length > 0 ? Math.max(...categories.map((c) => c.order)) : 0
        const newCategory: Category = {
          id: crypto.randomUUID(),
          name: categoryForm.name,
          order: maxOrder + 1,
        }
        setCategories([...categories, newCategory])
        const { error: insertError } = await supabase.from("categories").insert([
          { id: newCategory.id, name: newCategory.name, order: newCategory.order },
        ])
        if (insertError) {
          toast({ title: "エラー", description: insertError.message, variant: "destructive" })
        } else {
          toast({ title: "カテゴリーを追加しました", description: `${categoryForm.name}を追加しました。` })
        }
      }
      setIsCategoryDialogOpen(false)
    } catch (error: any) {
      toast({ title: "エラー", description: error?.message ?? "カテゴリーの保存に失敗しました", variant: "destructive" })
    }
  }

  // カテゴリ削除
  const handleDeleteCategory = async () => {
    if (currentCategory) {
      const usedCount = menuList.filter((menu) => menu.category === currentCategory.name).length
      if (usedCount > 0) {
        toast({
          title: "削除できません",
          description: "このカテゴリはメニューで使用されています。",
          variant: "destructive",
        })
        setIsDeleteCategoryDialogOpen(false)
        setCurrentCategory(null)
        return
      }

      const updatedCatList = categories.filter((cat) => cat.id !== currentCategory.id)
      setCategories(updatedCatList)
      const { error: deleteError } = await supabase.from("categories").delete().eq("id", currentCategory.id)
      if (deleteError) {
        toast({ title: "エラー", description: deleteError.message, variant: "destructive" })
      } else {
        toast({ title: "カテゴリーを削除しました", description: `${currentCategory.name}を削除しました。` })
      }
      setIsDeleteCategoryDialogOpen(false)
      setCurrentCategory(null)
    }
  }

  // ===== return部 =====
  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="menus">メニュー</TabsTrigger>
          <TabsTrigger value="categories">カテゴリー</TabsTrigger>
        </TabsList>

        {/* メニュータブ */}
        <TabsContent value="menus" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">メニュー一覧</h3>
            <Button onClick={openAddMenuDialog}>
              <Plus className="mr-2 h-4 w-4" />
              メニューを追加
            </Button>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">順番</TableHead>
                  <TableHead>メニュー名</TableHead>
                  <TableHead>カテゴリー</TableHead>
                  <TableHead>料金</TableHead>
                  <TableHead className="hidden md:table-cell">所要時間</TableHead>
                  <TableHead className="hidden md:table-cell">説明</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      メニューが登録されていません
                    </TableCell>
                  </TableRow>
                ) : (
                  [...menuList]
                    .sort((a, b) => a.order - b.order)
                    .map((menu, index, arr) => {
                      const isFirst = index === 0
                      const isLast = index === arr.length - 1

                      return (
                        <TableRow key={menu.id}>
                          <TableCell className="text-center">
                            <div className="flex flex-col space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveMenuUp(menu.id)}
                                disabled={isFirst}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <span className="text-xs text-muted-foreground">{menu.order}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveMenuDown(menu.id)}
                                disabled={isLast}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{menu.name}</TableCell>
                          <TableCell>{menu.category}</TableCell>
                          <TableCell>¥{Number(menu.price).toLocaleString()}</TableCell>
                          <TableCell className="hidden md:table-cell">{menu.duration}分</TableCell>
                          <TableCell className="hidden md:table-cell">
                            {menu.description ? (
                              <span className="line-clamp-1">{menu.description}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditMenuDialog(menu)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">編集</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteMenuDialog(menu)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">削除</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* カテゴリータブ */}
        <TabsContent value="categories" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">カテゴリー一覧</h3>
            <Button onClick={openAddCategoryDialog}>
              <Plus className="mr-2 h-4 w-4" />
              カテゴリーを追加
            </Button>
          </div>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">順番</TableHead>
                  <TableHead>カテゴリー名</TableHead>
                  <TableHead>使用中のメニュー数</TableHead>
                  <TableHead className="text-right">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center h-24">
                      カテゴリーが登録されていません
                    </TableCell>
                  </TableRow>
                ) : (
                  [...categories]
                    .sort((a, b) => a.order - b.order)
                    .map((category, index, arr) => {
                      const isFirst = index === 0
                      const isLast = index === arr.length - 1
                      const menuCount = menuList.filter((menu) => menu.category === category.name).length

                      return (
                        <TableRow key={category.id}>
                          <TableCell className="text-center">
                            <div className="flex flex-col space-y-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveCategoryUp(category.id)}
                                disabled={isFirst}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronUp className="h-3 w-3" />
                              </Button>
                              <span className="text-xs text-muted-foreground">{category.order}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveCategoryDown(category.id)}
                                disabled={isLast}
                                className="h-6 w-6 p-0"
                              >
                                <ChevronDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>{menuCount}件</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => openEditCategoryDialog(category)}>
                                <Pencil className="h-4 w-4" />
                                <span className="sr-only">編集</span>
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => openDeleteCategoryDialog(category)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                                <span className="sr-only">削除</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      {/* メニュー追加・編集ダイアログ */}
      <Dialog open={isMenuDialogOpen} onOpenChange={setIsMenuDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentMenu ? "メニュー編集" : "メニュー追加"}</DialogTitle>
            <DialogDescription>
              メニューの{currentMenu ? "内容を編集" : "新規追加"}します。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleMenuSubmit} className="space-y-4">
            <div>
              <Label>メニュー名</Label>
              <Input
                value={menuForm.name}
                onChange={e => setMenuForm({ ...menuForm, name: e.target.value })}
              />
              {menuErrors.name && <div className="text-xs text-red-500">{menuErrors.name}</div>}
            </div>
            <div>
              <Label>カテゴリー</Label>
              <Select
                value={menuForm.category}
                onValueChange={v => setMenuForm({ ...menuForm, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="カテゴリーを選択" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {menuErrors.category && <div className="text-xs text-red-500">{menuErrors.category}</div>}
            </div>
            <div>
              <Label>料金</Label>
              <Input
                type="number"
                value={menuForm.price}
                onChange={e => setMenuForm({ ...menuForm, price: e.target.value })}
              />
              {menuErrors.price && <div className="text-xs text-red-500">{menuErrors.price}</div>}
            </div>
            <div>
              <Label>所要時間(分)</Label>
              <Input
                type="number"
                value={menuForm.duration}
                onChange={e => setMenuForm({ ...menuForm, duration: e.target.value })}
              />
              {menuErrors.duration && <div className="text-xs text-red-500">{menuErrors.duration}</div>}
            </div>
            <div>
              <Label>説明</Label>
              <Textarea
                value={menuForm.description}
                onChange={e => setMenuForm({ ...menuForm, description: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="submit">{currentMenu ? "更新" : "追加"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* メニュー削除ダイアログ */}
      <AlertDialog open={isDeleteMenuDialogOpen} onOpenChange={setIsDeleteMenuDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {currentMenu?.name} を削除します。この操作は元に戻せません。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMenu} className="bg-red-500 hover:bg-red-600">
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ★★★ カテゴリー追加・編集ダイアログ(凝ったUI) ★★★ */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? "カテゴリーを編集" : "新規カテゴリー追加"}
            </DialogTitle>
            <DialogDescription>
              {currentCategory
                ? "カテゴリー情報を編集してください。"
                : "新しいカテゴリーを追加します。"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">カテゴリー名<span className="text-red-500 ml-1">*</span></Label>
              <Input
                id="category-name"
                autoFocus
                value={categoryForm.name}
                onChange={e => {
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                  if (categoryErrors.name) {
                    setCategoryErrors({ ...categoryErrors, name: "" })
                  }
                }}
                placeholder="例）ヘアケア"
                className={categoryErrors.name ? "border-red-500" : ""}
              />
              {categoryErrors.name && (
                <div className="text-sm text-red-500 mt-1">{categoryErrors.name}</div>
              )}
            </div>
            <DialogFooter className="flex justify-between items-center pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryDialogOpen(false)}
              >
                キャンセル
              </Button>
              <Button type="submit" className="ml-2">
                {currentCategory ? "更新" : "追加"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ★★★ カテゴリー削除確認ダイアログ(凝ったUI) ★★★ */}
      <AlertDialog open={isDeleteCategoryDialogOpen} onOpenChange={setIsDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              カテゴリーを削除しますか？
            </AlertDialogTitle>
            <AlertDialogDescription>
              {currentCategory && (
                <div>
                  <span className="font-medium">{currentCategory.name}</span> を削除します。<br />
                  この操作は <span className="font-bold text-red-600">元に戻せません</span>。<br />
                  <span className="text-xs text-red-500 block mt-2">
                    ※このカテゴリーを使用しているメニューがある場合は削除できません。
                  </span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCategory}
              className="bg-red-500 hover:bg-red-600"
            >
              削除する
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
