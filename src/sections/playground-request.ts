export const operations = [
  {
    id: 'profile',
    label: 'ENS profile',
    path: 'profile',
    docs: 'get-ens-profile',
  },
  {
    id: 'addresses',
    label: 'Address records',
    path: 'addresses',
    docs: 'get-ens-addresses',
  },
  { id: 'texts', label: 'Text records', path: 'texts', docs: 'get-ens-texts' },
  {
    id: 'contenthash',
    label: 'Content hash',
    path: 'contenthash',
    docs: 'get-ens-contenthash',
  },
  {
    id: 'reverse',
    label: 'Reverse lookup',
    path: 'reverse',
    docs: 'reverse-resolve-single',
  },
  {
    id: 'reverse-profile',
    label: 'Reverse profile',
    path: 'reverse',
    docs: 'reverse-resolve-profile',
  },
  {
    id: 'bulk-profile',
    label: 'Bulk profiles',
    path: 'profile/bulk',
    docs: 'get-bulk-ens-profiles',
  },
  {
    id: 'bulk-reverse',
    label: 'Bulk reverse lookup',
    path: 'reverse/bulk',
    docs: 'bulk-reverse-resolve',
  },
] as const

export type Operation = (typeof operations)[number]['id']
export interface RequestOptions {
  operation: Operation
  input: string
  texts: string
  addresses: string
  contenthash: boolean
}

export function buildRequest(base: string, options: RequestOptions): string {
  const { operation, input, texts, addresses, contenthash } = options
  const definition = operations.find((entry) => entry.id === operation)!
  const isBulk = operation.startsWith('bulk-')
  const isReverse = operation.includes('reverse')
  const values = isBulk
    ? input
        .split(/[\n,]/)
        .map((value) => value.trim())
        .filter(Boolean)
    : [input.trim()]
  if (!values.length || !values[0])
    throw new Error(
      isReverse ? 'Enter an Ethereum address.' : 'Enter an ENS name.',
    )
  if (values.length > 20)
    throw new Error('Use up to 20 names or addresses per request.')
  if (isReverse && values.some((value) => !/^0x[a-fA-F0-9]{40}$/.test(value)))
    throw new Error('Enter a complete Ethereum address starting with 0x.')
  if (
    !isReverse &&
    values.some((value) => !value.includes('.') || /[\s/?#]/.test(value))
  )
    throw new Error('Enter an ENS name such as vitalik.eth.')
  const path = isBulk
    ? definition.path
    : `${definition.path}/${encodeURIComponent(values[0])}${operation === 'reverse-profile' ? '/profile' : ''}`
  const url = new URL(`/ens/v2/${path}`, base)
  if (isBulk)
    url.searchParams.set(isReverse ? 'addresses' : 'names', values.join(','))
  if (['profile', 'reverse-profile', 'bulk-profile'].includes(operation)) {
    if (texts.trim()) url.searchParams.set('texts', texts.trim())
    if (addresses.trim()) url.searchParams.set('addresses', addresses.trim())
    url.searchParams.set('contenthash', String(contenthash))
  }
  if (operation === 'texts') {
    if (!texts.trim())
      throw new Error('Enter at least one text key, such as avatar.')
    url.searchParams.set('keys', texts.trim())
  }
  if (operation === 'addresses' && addresses.trim())
    url.searchParams.set('chains', addresses.trim())
  return url.href
}

export function curlCommand(url: string): string {
  return `curl '${url.replaceAll("'", "'\\''")}'`
}
