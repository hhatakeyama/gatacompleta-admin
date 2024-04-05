import { Select, TextInput } from '@mantine/core'

export const AcompanhantesField = ({ inputProps }) => (
  <Select
    {...inputProps}
    label="Acompanhantes"
    placeholder="Acompanhantes"
  />
)

export const StateField = ({ inputProps }) => (
  <Select
    {...inputProps}
    label="UF"
    placeholder="UF"
  />
)

export const CityField = ({ inputProps }) => (
  <Select
    {...inputProps}
    label="Cidade"
    placeholder="Cidade"
  />
)

export const DateField = ({ inputProps }) => (
  <TextInput
    type="date"
    {...inputProps}
  />
)
