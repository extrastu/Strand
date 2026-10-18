import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useT } from '@/i18n/use-t'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAppStore } from '@/store/app-store'

export function RemoveAccountDialog() {
  const t = useT()
  const dialog = useAppStore((s) => s.dialog)
  const account = useAppStore((s) => {
    const d = s.dialog
    return d?.kind === 'remove' ? s.accounts.find((a) => a.id === d.id) : undefined
  })
  const remove = useAppStore((s) => s.remove)
  const closeDialog = useAppStore((s) => s.closeDialog)
  const [pending, setPending] = useState(false)

  return (
    <AlertDialog open={dialog?.kind === 'remove' && account !== undefined} onOpenChange={(next) => !next && closeDialog()}>
      <AlertDialogContent className="rounded-2xl p-6 shadow-[var(--shadow-pop)]">
        <AlertDialogHeader>
          <AlertDialogMedia className="rounded-full bg-destructive/10 text-destructive">
            <Trash2 aria-hidden />
          </AlertDialogMedia>
          <AlertDialogTitle className="font-serif text-xl font-normal">{t('remove.title', { name: account?.name ?? '' })}</AlertDialogTitle>
          <AlertDialogDescription>{t('remove.description')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="-mx-6 -mb-6 rounded-b-2xl bg-transparent p-6 pt-2">
          <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            disabled={pending}
            onClick={(event) => {
              event.preventDefault()
              if (!account || pending) return
              setPending(true)
              void remove(account.id).finally(() => setPending(false))
            }}
          >
            {t('remove.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
