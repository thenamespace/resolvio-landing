import { useEffect, useRef, useState } from 'react'
import { Search, X, CheckSquare, Square } from 'lucide-react'
import styles from './RecordPickerModal.module.scss'
import { cx } from '../../utils/cx'

export interface PickerItem {
  id: string
  label: string
  sublabel?: string
  group?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  title: string
  items: PickerItem[]
  selected: string[]
  onChange: (next: string[]) => void
  /** If true, shows an input to add arbitrary custom keys */
  allowCustom?: boolean
}

export const RecordPickerModal = ({ isOpen, onClose, title, items, selected, onChange, allowCustom }: Props) => {
  const [search, setSearch]         = useState('')
  const [customInput, setCustomInput] = useState('')
  const backdropRef                 = useRef<HTMLDivElement>(null)
  const inputRef                    = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setSearch('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const q = search.toLowerCase()

  // Items from the predefined list filtered by search
  const filteredItems = items.filter(
    item => !q || item.id.toLowerCase().includes(q) || item.label.toLowerCase().includes(q)
  )

  // Custom keys = selected items not in the predefined list
  const predefinedIds = new Set(items.map(i => i.id))
  const customKeys = selected.filter(id => !predefinedIds.has(id))
  const filteredCustom = customKeys.filter(k => !q || k.toLowerCase().includes(q))

  // Group predefined items
  const groups = Array.from(new Set(filteredItems.map(i => i.group ?? ''))).filter(Boolean)
  const ungrouped = filteredItems.filter(i => !i.group)

  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }

  const selectAll = () => {
    const allIds = [...items.map(i => i.id), ...customKeys]
    onChange(allIds)
  }

  const clearAll = () => onChange([])

  const addCustom = () => {
    const key = customInput.trim()
    if (!key || selected.includes(key)) { setCustomInput(''); return }
    onChange([...selected, key])
    setCustomInput('')
  }

  const removeCustom = (key: string) => onChange(selected.filter(x => x !== key))

  const ItemRow = ({ item }: { item: PickerItem }) => {
    const active = selected.includes(item.id)
    return (
      <button
        className={cx(styles.item, active && styles.itemActive)}
        onClick={() => toggle(item.id)}
      >
        <span className={cx(styles.itemCheck, active && styles.itemCheckActive)}>
          {active ? <CheckSquare size={15} /> : <Square size={15} />}
        </span>
        <span className={styles.itemText}>
          <span className={styles.itemLabel}>{item.label}</span>
          <span className={styles.itemSub}>{item.sublabel ?? item.id}</span>
        </span>
      </button>
    )
  }

  return (
    <div className={styles.backdrop} ref={backdropRef} onClick={e => { if (e.target === backdropRef.current) onClose() }}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <p className={styles.headerTitle}>{title}</p>
          <div className={styles.headerActions}>
            <span className={styles.count}>{selected.length} selected</span>
            <button className={styles.actionBtn} onClick={selectAll}>All</button>
            <button className={styles.actionBtn} onClick={clearAll}>Clear</button>
            <button className={styles.closeBtn} onClick={onClose}><X size={16} /></button>
          </div>
        </div>

        {/* Search */}
        <div className={styles.searchRow}>
          <Search size={14} className={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className={styles.searchInput}
          />
          {search && <button className={styles.searchClear} onClick={() => setSearch('')}><X size={12} /></button>}
        </div>

        {/* List */}
        <div className={styles.list}>
          {groups.map(group => (
            <div key={group} className={styles.group}>
              <p className={styles.groupLabel}>{group}</p>
              <div className={styles.groupItems}>
                {filteredItems.filter(i => i.group === group).map(item => <ItemRow key={item.id} item={item} />)}
              </div>
            </div>
          ))}
          {ungrouped.length > 0 && (
            <div className={styles.groupItems}>
              {ungrouped.map(item => <ItemRow key={item.id} item={item} />)}
            </div>
          )}

          {/* Custom keys */}
          {filteredCustom.length > 0 && (
            <div className={styles.group}>
              <p className={styles.groupLabel}>Custom</p>
              <div className={styles.groupItems}>
                {filteredCustom.map(key => (
                  <div key={key} className={cx(styles.item, styles.itemActive)}>
                    <span className={cx(styles.itemCheck, styles.itemCheckActive)}><CheckSquare size={15} /></span>
                    <span className={styles.itemText}>
                      <span className={styles.itemLabel}>{key}</span>
                    </span>
                    <button className={styles.removeCustom} onClick={() => removeCustom(key)}><X size={12} /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredItems.length === 0 && filteredCustom.length === 0 && (
            <p className={styles.empty}>No results for "{search}"</p>
          )}
        </div>

        {/* Custom key input */}
        {allowCustom && (
          <div className={styles.customRow}>
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addCustom()}
              placeholder="Add custom key, e.g. com.farcaster"
              className={styles.customInput}
            />
            <button className={styles.customAddBtn} onClick={addCustom}>Add</button>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.doneBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  )
}
