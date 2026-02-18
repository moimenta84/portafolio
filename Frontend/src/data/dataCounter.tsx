export interface CounterItem {
  id: number
  endCounter: number
  text: string
  lineRight?: boolean
  lineRightMobile?: boolean
}

export const dataCounter: CounterItem[] = [
  {
    id: 1,
    endCounter: 4,
    text: "años de experiencia",
    lineRight: true,
    lineRightMobile: true,
  },
  {
    id: 2,
    endCounter: 12,
    text: " mis proyecto reales",
    lineRight: true,
    lineRightMobile: false,
  },
  {
    id: 3,
    endCounter: 5,
    text: "tecnologías utilizadas",
    lineRight: true,
    lineRightMobile: true,
  },
]
