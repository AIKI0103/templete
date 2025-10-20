export interface InputType {
  id: string
  name: string
  type: astroHTML.JSX.HTMLInputTypeAttribute
  labelName: string
  value?: string // オプショナルなプロパティ
  showValidTip: boolean
  placeholder?: string // オプショナルなプロパティ
  isRequired?: boolean
  autocomplete?: string // オプショナルなプロパティ
  inputmode?: 'email' | 'search' | 'tel' | 'text' | 'url' | 'none' | 'numeric' | 'decimal' | null | undefined // オプショナルなプロパティ
  isReadonly?: boolean
  size?: number | string
  maxlength?: number | string
  minlength?: number | string
  pattern?: string
  className?: string
}
