"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SalonInfoForm } from "@/components/settings/salon-info-form"
import { StaffManagement } from "@/components/settings/staff-management"
import { MenuManagement } from "@/components/settings/menu-management"
import MembershipRanks from '@/components/settings/membership-ranks'
import SystemSettings from "@/components/settings/system-settings"
import { Building, Users, Calendar, Award, Settings } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("salon-info")

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">設定</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="salon-info">
            <Building className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">サロン情報</span>
            <span className="sm:hidden">情報</span>
          </TabsTrigger>
          <TabsTrigger value="staff">
            <Users className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">スタッフ管理</span>
            <span className="sm:hidden">スタッフ</span>
          </TabsTrigger>
          <TabsTrigger value="menus">
            <Calendar className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">メニュー管理</span>
            <span className="sm:hidden">メニュー</span>
          </TabsTrigger>
          <TabsTrigger value="ranks">
            <Award className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">会員ランク</span>
            <span className="sm:hidden">ランク</span>
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">システム設定</span>
            <span className="sm:hidden">システム</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="salon-info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>サロン基本情報</CardTitle>
              <CardDescription>サロンの基本情報を設定します</CardDescription>
            </CardHeader>
            <CardContent>
              <SalonInfoForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>スタッフ管理</CardTitle>
              <CardDescription>スタッフ情報の管理と権限設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <StaffManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menus" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>メニュー管理</CardTitle>
              <CardDescription>施術メニューと料金の設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <MenuManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ranks" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>会員ランク設定</CardTitle>
              <CardDescription>会員ランクと特典の設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <MembershipRanks />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>システム設定</CardTitle>
              <CardDescription>システム全般の設定を行います</CardDescription>
            </CardHeader>
            <CardContent>
              <SystemSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

