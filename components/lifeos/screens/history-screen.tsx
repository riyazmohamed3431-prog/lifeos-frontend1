'use client'

import { useState } from 'react'
import { history, type HistoryItem } from '@/lib/lifeos'
import { AmbientBg } from '@/components/lifeos/ambient-bg'
import { CategoryIconBox, WarmBadge, WarmButton, WarmCard } from '@/components/ui/warm-components'
import { Wrench, ChevronRight, FileText, CheckCircle2, Search, Filter, Star, Calendar, Download, X } from 'lucide-react'
import { FadeIn, SlideUp, StaggerContainer, StaggerItem } from '@/components/ui/framer-wrapper'

export function HistoryScreen() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'All' | 'Completed' | 'Emergency'>('All')
  const [selectedReceipt, setSelectedReceipt] = useState<HistoryItem | null>(null)

  const filteredHistory = history.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mechanic.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeFilter === 'All') return matchesSearch
    return matchesSearch && item.status === activeFilter
  })

  return (
    <div className="relative h-full overflow-y-auto no-scrollbar px-4 sm:px-6 pt-3 pb-32 font-sans text-[#0F172A] dark:text-[#F8FAFC] max-w-4xl mx-auto">
      <AmbientBg tone="primary" />

      <div className="relative z-10 space-y-6">
        
        {/* Title Header */}
        <FadeIn delay={0.05} className="space-y-1">
          <WarmBadge variant="slate">Light Slate Service Records</WarmBadge>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A] dark:text-[#F8FAFC]">
            Dispatch & Assistance History
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Complete immutable log of all roadside assistance dispatches, invoices, and diagnostics.
          </p>
        </FadeIn>

        {/* Overview Key Metrics Cards */}
        <SlideUp delay={0.12} className="grid grid-cols-3 gap-2 sm:gap-3">
          <WarmCard variant="slate" className="p-2.5 sm:p-4 text-center min-w-0">
            <p className="text-xl sm:text-2xl font-black text-[#0F766E] font-mono truncate">{history.length}</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase mt-0.5 truncate">Total Rescues</p>
          </WarmCard>
          <WarmCard variant="slate" className="p-2.5 sm:p-4 text-center min-w-0">
            <p className="text-xl sm:text-2xl font-black text-[#F59E0B] font-mono truncate">4.98 ★</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase mt-0.5 truncate">Avg Rating</p>
          </WarmCard>
          <WarmCard variant="slate" className="p-2.5 sm:p-4 text-center min-w-0">
            <p className="text-xl sm:text-2xl font-black text-[#0F766E] font-mono truncate">₹0.00</p>
            <p className="text-[9px] sm:text-[10px] font-bold text-[#475569] dark:text-[#94A3B8] uppercase mt-0.5 truncate">Balance Due</p>
          </WarmCard>
        </SlideUp>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F1F5F9] dark:bg-[#1E293B] p-3 rounded-3xl border border-[#E2E8F0] dark:border-white/10 shadow-sm min-w-0">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#475569] dark:text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, vehicle, or technician..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl text-xs bg-white dark:bg-[#151C2C] border border-[#E2E8F0] dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-[#0F766E]/30 text-[#0F172A] dark:text-[#F8FAFC] placeholder:text-[#475569]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 self-start sm:self-auto overflow-x-auto no-scrollbar max-w-full pb-0.5">
            {(['All', 'Completed', 'Emergency'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  activeFilter === filter
                    ? 'bg-[#0F766E] text-white shadow-sm'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-foreground hover:bg-white/60'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Service History Timeline with Light Slate Cards */}
        <StaggerContainer className="space-y-3">
          {filteredHistory.length === 0 ? (
            <WarmCard variant="slate" className="p-8 text-center space-y-2">
              <p className="text-sm font-bold text-[#475569] dark:text-[#94A3B8]">No dispatch records found</p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Try adjusting your search query or filter options.</p>
            </WarmCard>
          ) : (
            filteredHistory.map((h) => (
              <StaggerItem key={h.id}>
                <WarmCard variant="slate" className="p-4 sm:p-5 space-y-4 border border-[#E2E8F0] dark:border-white/10 hover:border-[#0F766E]/40 transition-all min-w-0">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <div className="flex items-center gap-3.5 min-w-0 flex-1">
                      <CategoryIconBox icon={Wrench} color="blue" className="shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xs sm:text-sm font-black text-[#0F172A] dark:text-[#F8FAFC] truncate">{h.title}</h3>
                        <p className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] truncate">{h.date}</p>
                      </div>
                    </div>
                    <WarmBadge variant="emerald" className="shrink-0">
                      <CheckCircle2 className="size-3 text-[#0F766E]" /> {h.status}
                    </WarmBadge>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs text-[#475569] dark:text-[#94A3B8] pt-3 border-t border-[#E2E8F0] dark:border-white/10 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 min-w-0 flex-1">
                      <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC] truncate">{h.vehicle}</span>
                      <span className="shrink-0">•</span>
                      <span className="font-semibold truncate">Tech: {h.mechanic}</span>
                    </div>
                    <span className="font-mono font-black text-[#0F172A] dark:text-[#F8FAFC] text-sm shrink-0 ml-auto">₹{h.amount}</span>
                  </div>

                  <WarmButton
                    variant="ghost"
                    size="sm"
                    className="w-full bg-white dark:bg-[#151C2C] min-w-0"
                    onClick={() => setSelectedReceipt(h)}
                  >
                    <FileText className="size-4 text-[#0F766E] shrink-0" />
                    <span className="truncate">View Official Receipt & Diagnostics</span>
                    <ChevronRight className="size-3.5 text-[#475569] ml-auto shrink-0" />
                  </WarmButton>
                </WarmCard>
              </StaggerItem>
            ))
          )}
        </StaggerContainer>

      </div>

      {/* Official Receipt Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <WarmCard variant="white" className="relative w-full max-w-md p-6 space-y-5 border border-[#E2E8F0] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-[#0F766E]" />
                <h3 className="text-sm font-black text-[#0F172A] dark:text-[#F8FAFC]">Official Service Receipt</h3>
              </div>
              <button
                onClick={() => setSelectedReceipt(null)}
                className="p-1 rounded-full text-[#475569] hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#475569] dark:text-[#94A3B8] font-semibold">Service Log ID</span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">{selectedReceipt.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569] dark:text-[#94A3B8] font-semibold">Service Date</span>
                <span className="font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">{selectedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569] dark:text-[#94A3B8] font-semibold">Vehicle</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{selectedReceipt.vehicle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569] dark:text-[#94A3B8] font-semibold">Certified Technician</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">{selectedReceipt.mechanic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569] dark:text-[#94A3B8] font-semibold">Dispatch Hub</span>
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">NH-45 GST Road Corridor</span>
              </div>

              <div className="p-3 rounded-2xl bg-[#F1F5F9] dark:bg-[#1E293B] space-y-1.5 my-2">
                <div className="flex justify-between">
                  <span>Standard Breakdown Fee</span>
                  <span className="font-mono font-bold">₹{selectedReceipt.amount}.00</span>
                </div>
                <div className="flex justify-between">
                  <span>18% GST</span>
                  <span className="font-mono font-bold text-[#0F766E]">Included</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#E2E8F0] dark:border-white/10 font-black text-sm">
                  <span>Total Settled</span>
                  <span className="font-mono text-[#0F766E]">₹{selectedReceipt.amount}.00</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <WarmButton variant="primary" size="md" className="flex-1" onClick={() => setSelectedReceipt(null)}>
                Close Receipt
              </WarmButton>
            </div>
          </WarmCard>
        </div>
      )}
    </div>
  )
}
