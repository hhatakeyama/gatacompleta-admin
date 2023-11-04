import { Button, Grid, Group } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import React, { useState } from 'react'
import { useSWRConfig } from 'swr'

import { api, Yup } from '@/utils'

import * as Fields from './Fields'

export default function Phones({ acompanhanteId, phoneData }) {
  // Hooks
  const { mutate: mutateGlobal } = useSWRConfig()

  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const initialValues = {
    acompanhante_id: acompanhanteId,
    numero: phoneData?.numero || '',
    whatsapp: phoneData?.whatsapp || false,
    operadora_id: "1",
    status: "1",
  }

  const schema = Yup.object().shape({
    numero: Yup.string(),
    whatsapp: Yup.bool(),
  })

  // Mantine form
  const form = useForm({
    initialValues,
    validate: yupResolver(schema),
    validateInputOnBlur: true,
    validateInputOnChange: true
  })

  // Actions
  const handleSubmit = async (newValues) => {
    setIsSubmitting(true)
    if (phoneData) {
      return api
        .patch(`/admin/acompanhantes/${acompanhanteId}/telefones/${phoneData.id}`, newValues)
        .then(response => {
          mutateGlobal(`/admin/acompanhantes/${acompanhanteId}/telefones/`)
          showNotification({ title: 'Sucesso', message: 'Telefone atualizado com sucesso!', color: 'green' })
          return response?.data?.uid
        })
        .catch(response => {
          console.log(response)
          showNotification({ title: 'Erro', message: 'Ocorreu um erro ao atualizar o telefone. Tente novamente mais tarde.', color: 'red' })
        })
        .finally(() => setIsSubmitting(false))
    } else {
      return api
        .post(`/admin/acompanhantes/${acompanhanteId}/telefones`, newValues)
        .then(response => {
          mutateGlobal(`/admin/acompanhantes/${acompanhanteId}/telefones/`)
          showNotification({ title: 'Sucesso', message: 'Telefone cadastrado com sucesso!', color: 'green' })
          return response?.data?.uid
        })
        .catch(response => {
          console.log(response)
          showNotification({ title: 'Erro', message: 'Ocorreu um erro ao cadastrar o telefone. Tente novamente mais tarde.', color: 'red' })
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <Grid align="center">
        <Grid.Col span={{ base: 12, sm: 6}}>
          <Fields.PhoneNumberField
            inputProps={{
              ...form.getInputProps('numero'),
              disabled: isSubmitting,
            }}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 6}}>
          <Fields.WhatsappCheckboxField
            inputProps={{
              ...form.getInputProps('whatsapp', { type: 'checkbox' }),
              disabled: isSubmitting
            }}
          />
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        {phoneData && (
          <Button
            color="red"
            type="submit"
            size="sm"
            disabled={!form.isValid() || !form.isDirty()}
            loading={isSubmitting}>
            Remover
          </Button>
        )}
        <Button
          color="green"
          type="submit"
          size="sm"
          disabled={!form.isValid() || !form.isDirty()}
          loading={isSubmitting}>
          {phoneData ? "Editar" : "Salvar"}
        </Button>
      </Group>
    </form>
  )
}
