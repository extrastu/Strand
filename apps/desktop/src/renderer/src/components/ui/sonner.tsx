
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            'cn-toast !w-auto !min-w-[260px] !max-w-[440px] !h-auto !min-h-10 !rounded-2xl !px-4 !py-2.5 !text-[13px] !shadow-[var(--shadow-pop)] !gap-3',
          title: '!text-[13px] !font-medium !leading-snug !whitespace-nowrap',
          description: '!text-[12px] !text-muted-foreground !leading-tight',
          actionButton:
            '!bg-primary !text-primary-foreground hover:!opacity-90 !rounded-lg !px-3 !py-1 !text-xs !font-medium !shrink-0 !whitespace-nowrap',
          cancelButton:
            '!bg-secondary !text-secondary-foreground !rounded-lg !px-3 !py-1 !text-xs !shrink-0 !whitespace-nowrap',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
