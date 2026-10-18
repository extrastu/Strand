'use client'

import React, { useState } from 'react'
import {
  PanelLeftClose,
  PanelLeft,
  Settings,
  Heart,
  MessageCircle,
  Repeat2,
  Send,
  MoreHorizontal,
  X,
  Check,
  ChevronDown,
  Plus,
} from 'lucide-react'
import type { Language } from '@/lib/i18n/content'
import { content } from '@/lib/i18n/content'

interface AppMockupProps {
  lang: Language
  darkMode?: boolean
}

export const AppMockup: React.FC<AppMockupProps> = ({ lang }) => {
  const t = content[lang].mockup
  const [activeAccountId, setActiveAccountId] = useState('1')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState<'general' | 'about'>('general')
  const [mockTheme, setMockTheme] = useState<'system' | 'light' | 'dark'>('system')
  const [liked, setLiked] = useState(false)

  const activeAccount = t.accounts.find((a) => a.id === activeAccountId) || t.accounts[0]!

  return (
    <section id="showcase" className="py-12 sm:py-20 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section title & hint */}
        <div className="text-center mb-8">
          <span className="text-xs font-mono font-medium tracking-wider text-neutral-500 uppercase">
            Interactive Showcase
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-1">
            {lang === 'en' ? 'Try Strand right in your browser' : '在浏览器中即刻把玩 Strand 原生体验'}
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2">
            {t.switchHint}
          </p>
        </div>

        {/* macOS Window Frame */}
        <div className="relative rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800/90 shadow-2xl bg-white dark:bg-[#101010] transition-all duration-300">
          {/* macOS Titlebar */}
          <div className="h-10 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-neutral-100/90 dark:bg-[#161618] flex items-center justify-between px-3.5 select-none">
            {/* Traffic lights */}
            <div className="flex items-center gap-2 w-20">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e]/40 shadow-2xs inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123]/40 shadow-2xs inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29]/40 shadow-2xs inline-block" />
            </div>

            {/* Window Title */}
            <div className="text-xs font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5 truncate">
              <span>Strand</span>
              <span className="text-neutral-400 dark:text-neutral-600">—</span>
              <span className="text-neutral-800 dark:text-neutral-200 font-semibold">{activeAccount.handle}</span>
            </div>

            {/* Right window actions */}
            <div className="flex items-center gap-1 justify-end w-20">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-1 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
                title={t.toggleSidebar}
              >
                {sidebarOpen ? <PanelLeftClose className="w-3.5 h-3.5" /> : <PanelLeft className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-1 rounded hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 transition-colors"
                title={t.settingsTitle}
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Window Body */}
          <div className="relative flex h-[520px] overflow-hidden bg-neutral-50 dark:bg-[#101010]">
            {/* Sidebar (with transition width) */}
            <div
              className={`transition-all duration-300 ease-in-out border-r border-neutral-200 dark:border-neutral-800/80 bg-[#f6f7f9] dark:bg-[#131315] flex flex-col justify-between overflow-hidden shrink-0 ${
                sidebarOpen ? 'w-56' : 'w-0 border-r-0'
              }`}
            >
              {/* Top Section */}
              <div className="p-3 space-y-3">
                {/* Account Switcher Header */}
                <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-neutral-200/50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <div className="w-5 h-5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-[10px]">
                      {activeAccount.name[0]}
                    </div>
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                      {activeAccount.handle}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </div>

                {/* Account Rows */}
                <div className="space-y-1">
                  <div className="text-[10px] font-semibold text-neutral-400 px-2 uppercase tracking-wider">
                    {lang === 'en' ? 'Accounts' : '已配置账号'}
                  </div>
                  {t.accounts.map((acc, index) => {
                    const isSelected = acc.id === activeAccountId
                    return (
                      <button
                        key={acc.id}
                        onClick={() => setActiveAccountId(acc.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-all ${
                          isSelected
                            ? 'bg-[#e4e6eb] dark:bg-[#202024] text-neutral-900 dark:text-white font-medium shadow-2xs'
                            : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className="w-6 h-6 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                            {acc.name[0]}
                          </div>
                          <div className="truncate">
                            <div className="truncate leading-tight">{acc.name}</div>
                            <div className="text-[10px] opacity-60 leading-tight">{acc.handle}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                          ⌘{index + 1}
                        </span>
                      </button>
                    )
                  })}

                  <button className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs text-neutral-500 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Add Account' : '添加账号'}</span>
                  </button>
                </div>
              </div>

              {/* Bottom Settings Button */}
              <div className="p-3 border-t border-neutral-200/70 dark:border-neutral-800/70">
                <button
                  onClick={() => setShowSettings(true)}
                  className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{t.settingsTitle}</span>
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 z-10 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#101010]/80 backdrop-blur-md px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm font-semibold">
                  <span className="text-neutral-900 dark:text-neutral-100 border-b-2 border-neutral-900 dark:border-white pb-1">
                    {lang === 'en' ? 'For you' : '为你推荐'}
                  </span>
                  <span className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 cursor-pointer pb-1">
                    {lang === 'en' ? 'Following' : '已关注'}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 font-mono">
                  {lang === 'en' ? 'Session: ' : '会话沙箱: '}
                  <span className="text-emerald-500">persist:account-{activeAccount.id}</span>
                </div>
              </div>

              {/* Feed Content */}
              <div className="p-6 max-w-xl mx-auto w-full space-y-4">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-2xs flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs shrink-0">
                    {activeAccount.name[0]}
                  </div>
                  <div className="flex-1 text-xs text-neutral-400 flex items-center justify-between">
                    <span>{lang === 'en' ? "What's new?" : '发条新帖...'}</span>
                    <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 font-medium text-neutral-600 dark:text-neutral-300">
                      Post
                    </span>
                  </div>
                </div>

                {/* Sample Post */}
                <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#161618] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 flex items-center justify-center font-bold text-xs">
                        {activeAccount.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                          <span>{activeAccount.name}</span>
                          <span className="text-[10px] font-normal text-neutral-400">{activeAccount.handle}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400">{t.samplePost.time}</div>
                      </div>
                    </div>
                    <MoreHorizontal className="w-4 h-4 text-neutral-400" />
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 leading-relaxed">
                    {t.samplePost.text}
                  </p>

                  <div className="pt-2 flex items-center gap-6 text-neutral-500 text-xs">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-500 font-semibold' : 'hover:text-red-500'}`}
                    >
                      <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                      <span>{liked ? t.samplePost.likes + 1 : t.samplePost.likes}</span>
                    </button>
                    <div className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
                      <MessageCircle className="w-4 h-4" />
                      <span>{t.samplePost.replies}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
                      <Repeat2 className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 cursor-pointer">
                      <Send className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Settings Dialog Overlay Modal */}
            {showSettings && (
              <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white dark:bg-[#18181b] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-5 py-3.5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">
                      {t.settingsTitle}
                    </h3>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex h-64">
                    <div className="w-36 border-r border-neutral-200 dark:border-neutral-800 p-2 space-y-1 bg-neutral-50 dark:bg-[#141416]">
                      <button
                        onClick={() => setActiveTab('general')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium ${
                          activeTab === 'general'
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        {lang === 'en' ? 'General' : '通用设置'}
                      </button>
                      <button
                        onClick={() => setActiveTab('about')}
                        className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-medium ${
                          activeTab === 'about'
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                            : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                        }`}
                      >
                        {t.aboutLabel}
                      </button>
                    </div>

                    <div className="flex-1 p-5 overflow-y-auto text-xs space-y-4">
                      {activeTab === 'general' ? (
                        <>
                          <div>
                            <div className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              {t.themeLabel}
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              {(['system', 'light', 'dark'] as const).map((mode) => (
                                <button
                                  key={mode}
                                  onClick={() => setMockTheme(mode)}
                                  className={`px-2 py-1.5 rounded border text-center capitalize transition-colors ${
                                    mockTheme === mode
                                      ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-neutral-900 font-semibold'
                                      : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                                  }`}
                                >
                                  {mode}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <div className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                              {t.langLabel}
                            </div>
                            <div className="p-2 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 flex items-center justify-between">
                              <span>{lang === 'en' ? 'English' : '简体中文'}</span>
                              <Check className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-2 space-y-2">
                          <img src="/icon.svg" alt="Strand" className="w-12 h-12 mx-auto rounded-xl" />
                          <div className="font-bold text-sm text-neutral-900 dark:text-white">Strand</div>
                          <div className="text-[11px] text-neutral-400">Version 0.2.0 (macOS)</div>
                          <div className="text-[10px] text-neutral-500 leading-normal pt-2">
                            {lang === 'en'
                              ? 'An unofficial multi-account client for Threads on macOS. Not affiliated with or endorsed by Meta or Threads.'
                              : '专为 macOS 打造的 Threads 非官方多账号桌面客户端。与 Meta 或 Threads 无官方隶属关系。'}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
