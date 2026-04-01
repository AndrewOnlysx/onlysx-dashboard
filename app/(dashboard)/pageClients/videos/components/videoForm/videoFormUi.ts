import { cn } from '@/lib/utils'

export type VideoFormTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger'

export const videoFormSurfaceClassName = 'rounded-[6px] border border-[#262c35] bg-[#101319] p-5 text-[#f5f7fb] shadow-[0_18px_44px_rgba(0,0,0,0.28)]'
export const videoFormInsetClassName = 'rounded-[6px] border border-[#262c35] bg-[#171b22] p-4 text-[#f5f7fb] shadow-none'
export const videoFormMetricClassName = 'rounded-[6px] border border-[#262c35] bg-[#14181f] p-4 text-[#f5f7fb]'
export const videoFormDropzoneClassName = 'rounded-[6px] border border-dashed border-[#303640] bg-[#14181f] p-4 text-[#f5f7fb] transition-colors'
export const videoFormLabelClassName = 'text-[12px] font-semibold uppercase tracking-[0.14em] text-[#8f97a8]'
export const videoFormSectionTitleClassName = 'text-[20px] font-semibold tracking-[-0.02em] text-[#f5f7fb]'
export const videoFormBodyTextClassName = 'text-[14px] font-normal leading-6 text-[#c1c8d3]'
export const videoFormMutedTextClassName = 'text-[13px] font-normal leading-5 text-[#8f97a8]'
export const videoFormInputClassName = 'h-11 w-full rounded-[6px] border border-[#303640] bg-[#0f1218] px-2 text-[14px] font-normal leading-5 text-[#f5f7fb] outline-none transition-colors placeholder:text-[#6f7888] focus:border-[var(--primary)]'
export const videoFormTextareaClassName = 'min-h-[120px] w-full rounded-[6px] border border-[#303640] bg-[#0f1218] px-3 py-3 text-[14px] font-normal leading-6 text-[#f5f7fb] outline-none transition-colors placeholder:text-[#6f7888] focus:border-[var(--primary)]'
export const videoFormPrimaryActionClassName = 'inline-flex min-h-11 items-center justify-center rounded-[6px] border border-[var(--primary)] bg-[var(--primary)] px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:border-[#ff72ba] hover:bg-[#ff72ba] disabled:cursor-not-allowed disabled:border-[#3b4351] disabled:bg-[#3b4351] disabled:text-[#8f97a8]'
export const videoFormSecondaryActionClassName = 'inline-flex min-h-11 items-center justify-center rounded-[6px] border border-[#303640] bg-[#171b22] px-4 py-2.5 text-[13px] font-medium text-[#f5f7fb] transition-colors hover:border-[var(--primary)] hover:text-white disabled:cursor-not-allowed disabled:border-[#262c35] disabled:bg-[#14181f] disabled:text-[#6f7888]'

export const getVideoFormBadgeClassName = (tone: VideoFormTone = 'neutral') => cn(
    'inline-flex items-center justify-center rounded-[6px] border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]',
    tone === 'neutral' && 'border-[#303640] bg-[#171b22] text-[#aeb7c6]',
    tone === 'accent' && 'border-[#6b2f52] bg-[#27111e] text-[#ff8ecb]',
    tone === 'success' && 'border-[#475c26] bg-[#171f0f] text-[#d4ff59]',
    tone === 'warning' && 'border-[#6b4f1f] bg-[#21190e] text-[#ffcc63]',
    tone === 'danger' && 'border-[#6d3036] bg-[#261215] text-[#ff9ca4]'
)

export const getVideoFormProgressClassName = (tone: Exclude<VideoFormTone, 'neutral'>) => cn(
    'h-full rounded-[6px] transition-all',
    tone === 'accent' && 'bg-[var(--primary)]',
    tone === 'success' && 'bg-[#caff36]',
    tone === 'warning' && 'bg-[#ff9f1a]',
    tone === 'danger' && 'bg-[#ef626c]'
)