import { Alert, Button, Grid, Group, LoadingOverlay, Stack, useMantineTheme } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import { useMediaQuery } from '@mantine/hooks'
import React, { useState } from 'react'
import { useSWRConfig } from 'swr'

import { useAuth } from '@/providers/AuthProvider'
import { api, Yup } from '@/utils'

import * as Fields from './Fields'

export default function Basic({ acompanhanteData }) {
  // Hooks
  const { isValidating } = useAuth()
  const theme = useMantineTheme()
  const { mutate: mutateGlobal } = useSWRConfig()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs}px)`)

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const initialValues = {
    nome: acompanhanteData?.usuario?.name || '',
    email: acompanhanteData?.usuario?.email || '',
    senha: '',
    confirmSenha: '',
    oldSenha: '',
    ...acompanhanteData
  }

  const schema = Yup.object().shape({
    nome: Yup.string().required(),
    email: Yup.string().email().required(),
    senha: Yup.string(),
    confirmSenha: Yup.string().oneOf([Yup.ref('senha'), null], 'Senhas diferentes'),
    oldSenha: Yup.string().when('senha', {
      is: (senha) => senha.length > 0,
      then: Yup.string().required('Senha antiga obrigatória')
    }),
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
    setError(null)
    setIsSubmitting(true)

    if (form.isDirty()) {
      api
        // .patch(`/admin/accounts/me/`, { user: newValues }) /*ou*/ .post(`/admin/acompanhantes/${acompanhante?.id}/`) // Verificar usuário logado no painel
        .then(response => {
          mutateGlobal(`/admin/accounts/me/`)
          showNotification({
            title: 'Sucesso',
            message: successMessage,
            color: 'blue'
          })
          return response?.data?.uid
        })
        .catch(errorHandler)
        .finally(() => setIsSubmitting(false))
    }

    if (newValues.senha) {
      api
        .post(`/admin/acompanhantes/${acompanhante?.id}/`, {
          oldSenha: newValues.oldSenha,
          newSenha: newValues.senha
        })
        .then(() => {
          showNotification({
            title: 'Sucesso',
            message: 'Senha atualizada com sucesso',
            color: 'blue'
          })
          router.reload()
        })
        .catch(response => {
          if (response?.error) setError(response.error)
        })
        .finally(() => setIsSubmitting(false))
    }
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: 'relative' }}>
      <LoadingOverlay visible={isValidating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack>
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.NameField
                  inputProps={{ ...form.getInputProps('nome'), disabled: isSubmitting }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.EmailField
                  inputProps={{ ...form.getInputProps('email'), disabled: isSubmitting }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.PasswordField
                  inputProps={{
                    ...form.getInputProps('password'),
                    disabled: isSubmitting
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.ConfirmPasswordField
                  inputProps={{
                    ...form.getInputProps('confirmPassword'),
                    disabled: isSubmitting
                  }}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.OldPasswordField
                  inputProps={{
                    ...form.getInputProps('oldPassword'),
                    disabled: isSubmitting
                  }}
                />
              </Grid.Col>
            </Grid>
            
            <Fields.AboutField
              inputProps={{ ...form.getInputProps('sobre'), disabled: isSubmitting }}
            />
            <Grid>
              <Grid.Col span={4}>
                <Fields.StateField
                  inputProps={{ ...form.getInputProps('uf'), disabled: isSubmitting }}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                <Fields.CityField
                  inputProps={{ ...form.getInputProps('cidade'), disabled: isSubmitting }}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack>
            {/* {JSON.stringify(acompanhanteData)} */}
            <Grid>
              <Grid.Col span={{ base: 12, sm: 6 }}>
                <Fields.NameField
                  inputProps={{ ...form.getInputProps('nome'), disabled: isSubmitting }}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>
      </Grid>

      {!!error && <Alert color="red" title="Erro">{error}</Alert>}

      <Group mt="xl">
        <Button
          color="green"
          type="submit"
          size={isXs ? 'sm' : 'md'}
          fullWidth={!!isXs}
          disabled={!form.isValid() || !form.isDirty()}
          loading={isSubmitting}>
          Salvar
        </Button>
      </Group>
    </form>
  )
}
