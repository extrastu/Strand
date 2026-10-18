import { useState } from 'react'
import type { FormEvent } from 'react'
import { ACCOUNT_TYPES, MAX_NAME_LENGTH } from '@shared/types'
import type { Account, AccountType } from '@shared/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useT } from '@/i18n/use-t'
import { TYPE_HINT_KEY, TYPE_LABEL_KEY } from '@/lib/labels'
import { useAppStore } from '@/store/app-store'

export function AccountDialog() {
  const dialog = useAppStore((s) => s.dialog)
  const accounts = useAppStore((s) => s.accounts)
  const closeDialog = useAppStore((s) => s.closeDialog)

  const open = dialog?.kind === 'add' || dialog?.kind === 'edit'
  const editing = dialog?.kind === 'edit' ? accounts.find((a) => a.id === dialog.id) : undefined

  return (
    <Dialog open={open} onOpenChange={(next) => !next && closeDialog()}>
      <DialogContent className="gap-5 rounded-2xl p-6 shadow-[var(--shadow-pop)] sm:max-w-md">
        {open && <AccountForm key={editing?.id ?? 'new'} editing={editing} />}
      </DialogContent>
    </Dialog>
  )
}

function AccountForm({ editing }: { editing: Account | undefined }) {
  const t = useT()
  const save = useAppStore((s) => s.save)
  const closeDialog = useAppStore((s) => s.closeDialog)
  const [name, setName] = useState(editing?.name ?? '')
  const [type, setType] = useState<AccountType>(editing?.type ?? 'personal')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    const length = [...trimmed].length
    if (length === 0) return setError(t('account.nameRequired'))
    if (length > MAX_NAME_LENGTH) return setError(t('account.nameTooLong', { max: MAX_NAME_LENGTH }))
    setError('')
    setPending(true)
    const ok = await save(editing?.id ?? null, { name: trimmed, type })
    setPending(false)
    if (ok) closeDialog()
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="grid gap-5" noValidate>
      <DialogHeader>
        <DialogTitle className="font-serif text-xl font-normal">{editing ? t('account.editTitle') : t('account.addTitle')}</DialogTitle>
        <DialogDescription>
          {editing ? t('account.editDescription') : t('account.addDescription')}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-2">
        <Label htmlFor="account-name">{t('account.nameLabel')}</Label>
        <Input
          id="account-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('account.namePlaceholder')}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'account-error' : undefined}
          className="h-10 rounded-xl border-input bg-background px-3 text-sm focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
        />
        {error && (
          <p id="account-error" role="alert" className="text-[13px] text-destructive">
            {error}
          </p>
        )}
      </div>

      <div className="grid gap-2">
        <Label id="account-type-label">{t('account.typeLabel')}</Label>
        <RadioGroup
          value={type}
          onValueChange={(v) => setType(v as AccountType)}
          aria-labelledby="account-type-label"
          className="grid-cols-2"
        >
          {ACCOUNT_TYPES.map((kind) => (
            <Label
              key={kind}
              htmlFor={`account-type-${kind}`}
              className="flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors duration-150 hover:bg-accent has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/5"
            >
              <RadioGroupItem value={kind} id={`account-type-${kind}`} className="mt-0.5" />
              <span className="grid gap-0.5">
                <span className="font-medium">{t(TYPE_LABEL_KEY[kind])}</span>
                <span className="text-xs font-normal text-muted-foreground">{t(TYPE_HINT_KEY[kind])}</span>
              </span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={closeDialog}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={pending}>
          {editing ? t('account.submitSave') : t('account.submitAdd')}
        </Button>
      </div>
    </form>
  )
}
