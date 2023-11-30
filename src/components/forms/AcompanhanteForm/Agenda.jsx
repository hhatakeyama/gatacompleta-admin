import { Button, Grid, Group } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { showNotification } from '@mantine/notifications'
import React, { useState } from 'react'

import { api, Yup } from '@/utils'

import * as Fields from './Fields'

export default function Agenda({ acompanhanteId, agendaData, onSuccess }) {
  // States
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const initialValues = {
    acompanhante_id: acompanhanteId,
    estado_id: agendaData?.cidade?.estado_id || '',
    cidade_id: agendaData?.cidade?.cidade_id || '',
    dataInicio: agendaData?.dataInicio || '',
    dataFim: agendaData?.dataFim || '',
  }

  const schema = Yup.object().shape({
    uf: Yup.string(),
    cidade: Yup.string(),
    dataInicio: Yup.string(),
    dataFim: Yup.string(),
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
    if (agendaData) {
      return api
        .patch(`/admin/acompanhantes/${acompanhanteId}/agendas/${agendaData.id}`, newValues)
        .then(response => {
          onSuccess?.()
          showNotification({ title: 'Sucesso', message: response?.data?.message || 'Agenda atualizada com sucesso!', color: 'green' })
        })
        .catch(response => {
          showNotification({ title: 'Erro', message: response?.data?.message || 'Ocorreu um erro ao atualizar a agenda. Tente novamente mais tarde.', color: 'red' })
        })
        .finally(() => {
          setIsSubmitting(false)
          form.resetDirty()
          form.resetTouched()
        })
    } else {
      return api
        .post(`/admin/acompanhantes/${acompanhanteId}/agendas`, newValues)
        .then(response => {
          onSuccess?.()
          showNotification({ title: 'Sucesso', message: response?.data?.message || 'Agenda cadastrada com sucesso!', color: 'green' })
        })
        .catch(response => {
          showNotification({
            title: 'Erro',
            message: response?.data?.message || 'Ocorreu um erro ao cadastrar a agenda. Tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => {
          setIsSubmitting(false)
          form.reset()
        })
    }
  }

  const handleDelete = async () => {
    setIsSubmitting(true)
    if (agendaData) {
      return api
        .delete(`/admin/acompanhantes/${acompanhanteId}/agendas/${agendaData.id}`)
        .then(response => {
          onSuccess?.()
          showNotification({ title: 'Sucesso', message: response?.data?.message || 'Agenda removida com sucesso!', color: 'green' })
        })
        .catch(response => {
          showNotification({
            title: 'Erro',
            message: response?.data?.message || 'Ocorreu um erro ao remover a agenda. Tente novamente mais tarde.',
            color: 'red'
          })
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <Grid align="center">
        <Grid.Col span={4}>
          <Fields.StateField inputProps={{ ...form.getInputProps('uf'), disabled: isSubmitting }} />
        </Grid.Col>
        <Grid.Col span={8}>
          <Fields.CityField inputProps={{ ...form.getInputProps('cidade_id'), disabled: isSubmitting }} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Fields.DateField inputProps={{ ...form.getInputProps('data_inicio'), disabled: isSubmitting }} />
        </Grid.Col>
        <Grid.Col span={6}>
          <Fields.DateField inputProps={{ ...form.getInputProps('data_fim'), disabled: isSubmitting }} />
        </Grid.Col>
      </Grid>
      <Group mt="xl">
        {agendaData && (
          <Button
            color="red"
            type="button"
            size="sm"
            onClick={handleDelete}
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
          {agendaData ? "Editar" : "Salvar"}
        </Button>
      </Group>
    </form>
  )
}
