import type { MessageKey } from './zh-CN'

// English. Typed against the Chinese keys, so a missing or extra key is a compile error.
export const en: Record<MessageKey, string> = {
  'common.close': 'Close',
  'common.cancel': 'Cancel',

  'sidebar.aria': 'Accounts',
  'sidebar.heading': 'Accounts',
  'sidebar.add': 'Add account',
  'sidebar.settings': 'Settings',
  'titlebar.hideSidebar': 'Hide sidebar',
  'titlebar.showSidebar': 'Show sidebar',

  'type.personal': 'Personal',
  'type.creator': 'Creator',
  'type.personalHint': 'For everyday use',
  'type.creatorHint': 'For publishing content',

  'row.more': 'More actions for {name}',
  'row.copyName': 'Copy account name',
  'row.edit': 'Edit',
  'row.delete': 'Delete',

  'account.addTitle': 'Add account',
  'account.editTitle': 'Edit account',
  'account.addDescription': 'After adding, sign in with your Threads account on the right.',
  'account.editDescription': 'Changing the name or type keeps you signed in.',
  'account.nameLabel': 'Name',
  'account.namePlaceholder': 'e.g. Main',
  'account.typeLabel': 'Type',
  'account.nameRequired': 'Enter an account name',
  'account.nameTooLong': 'Names can be at most {max} characters',
  'account.submitAdd': 'Add',
  'account.submitSave': 'Save',

  'remove.title': 'Delete account "{name}"?',
  'remove.description': "This signs the account out of Strand. Your Threads account itself isn't affected.",
  'remove.confirm': 'Delete',

  'empty.title': 'No accounts yet',
  'empty.description': 'Add an account, then sign in with your Threads account on the right. Personal and creator accounts stay separate.',

  'toast.copied': 'Copied account name: {name}',
  'toast.copyFailed': "Couldn't copy. Try again.",
  'toast.switchFailed': "Couldn't switch accounts. Try again.",
  'toast.saveFailed': "Couldn't save. Names must be 1–40 characters.",
  'toast.deleteFailed': "Couldn't delete the account. Try again.",
  'toast.loadFailed': "Couldn't load your accounts. Restart the app.",
  'toast.sidebarFailed': "Couldn't toggle the sidebar. Try again.",
  'toast.syncFailed': "Couldn't update the view. Try again.",
  'toast.settingsFailed': "Couldn't save the setting. Try again.",
  'toast.settingsLoadFailed': "Couldn't load your settings. Using the defaults.",

  'settings.title': 'Settings',
  'settings.description': 'Adjust the theme and language, and see app info.',
  'settings.nav': 'Settings sections',
  'settings.general': 'General',
  'settings.about': 'About',
  'settings.theme.label': 'Theme',
  'settings.theme.description': 'Choose how the app and account pages look.',
  'settings.theme.system': 'System',
  'settings.theme.light': 'Light',
  'settings.theme.dark': 'Dark',
  'settings.language.label': 'Language',
  'settings.language.description': "The language of the app interface. Threads pages aren't affected.",

  'about.iconAlt': 'Strand icon',
  'about.version': 'Version {version}',
  'about.description': 'An unofficial multi-account Threads client for macOS.',
  'about.runtime': 'Electron {electron} · Chromium {chromium}',
  'about.unavailable': "Version information isn't available right now.",
  'about.notice': "Strand isn't affiliated with or endorsed by Meta or Threads.",
}
