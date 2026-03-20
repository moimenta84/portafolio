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
    endCounter: 17,
    text: "certificaciones UST",
    lineRight: true,
    lineRightMobile: true,
  },
  {
    id: 2,
    endCounter: 270,
    text: "horas React · Adecco",
    lineRight: true,
    lineRightMobile: false,
  },
  {
    id: 3,
    endCounter: 15,
    text: "tecnologías dominadas",
    lineRight: false,
    lineRightMobile: false,
  },
]
