"use client"

import {
  Alert,
  Button,
  FileButton,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  Select,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core"
import { useForm, yupResolver } from "@mantine/form"
import { useMediaQuery } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import { IconCameraOff } from "@tabler/icons-react"
import React, { useState } from "react"
import { useSWRConfig } from "swr"

import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { api, Yup } from "@/utils"
import errorHandler from "@/utils/errorHandler"

import * as Fields from "./Fields"

export default function Basic({ anuncioData, onClose, onCallback }) {
  // Hooks
  const { isValidating } = useAuth()
  const theme = useMantineTheme()
  const { mutate: mutateGlobal } = useSWRConfig()
  const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`)

  // States
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Constants
  const editing = !!anuncioData
  const initialValues = {
    foto: anuncioData?.foto || null,
    tipo: anuncioData?.tipo || "",
    acompanhante_id: anuncioData?.acompanhante_id?.toString() || "",
    data_inicio: anuncioData?.data_inicio || "",
    data_fim: anuncioData?.data_fim || "",
    estado_id: anuncioData?.estado_id || "",
    cidade_id: anuncioData?.cidade_id?.toString() || "",
    status: anuncioData?.status?.toString() || "0",
  }

  const schema = Yup.object().shape({
    foto: Yup.mixed().required(),
    tipo: Yup.string().required(),
    acompanhante_id: Yup.string().required(),
    data_inicio: Yup.string().required(),
    data_fim: Yup.string().required(),
    estado_id: Yup.string().nullable(),
    cidade_id: Yup.string().nullable(),
    status: Yup.string().nullable(),
  })

  // Mantine form
  const form = useForm({
    initialValues,
    validate: yupResolver(schema),
    validateInputOnBlur: true,
    validateInputOnChange: true,
  })

  // Fetch
  const { data } = useFetch(["/admin/estados"])
  const { data: dataCidades } = useFetch([
    form.values.estado_id ? `/admin/estados/${form.values.estado_id}/cidades` : null,
  ])
  const optionsEstados = data?.map(estado => ({ value: estado.id, label: estado.nome })) || []
  const optionsCidades =
    dataCidades?.map(cidade => ({ value: cidade.id.toString(), label: cidade.nome })) || []

  const { data: dataAcompanhantes } = useFetch(["/admin/acompanhantes/all-active"])
  const optionsAcompanhantes =
    dataAcompanhantes?.map(acompanhante => ({
      label: `${acompanhante.id.toString()} - ${acompanhante.nome}`,
      value: acompanhante.id.toString(),
    })) || []

  // Actions
  const handleSubmit = async newValues => {
    setError(null)
    setIsSubmitting(true)
    if (form.isDirty()) {
      const formData = new FormData()
      formData.append("foto", newValues.foto)
      formData.append("tipo", newValues.tipo)
      formData.append("acompanhante_id", newValues.acompanhante_id)
      formData.append("data_inicio", newValues.data_inicio)
      formData.append("data_fim", newValues.data_fim)
      formData.append("estado_id", newValues.estado_id)
      formData.append("cidade_id", newValues.cidade_id)
      formData.append("status", newValues.status)

      return api
        .post(`/api/admin/anuncios${editing ? `/${anuncioData?.id}` : ""}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then(response => {
          if (editing) {
            mutateGlobal(`/api/admin/anuncios/${anuncioData?.id}`)
            form.resetTouched()
            form.resetDirty()
          } else {
            onClose?.()
            onCallback?.(response)
          }
          notifications.show({
            title: "Sucesso",
            message: `Dados ${editing ? "atualizados" : "cadastrados"} com sucesso!`,
            color: "green",
          })
        })
        .catch(error =>
          notifications.show({
            title: "Erro",
            message:
              errorHandler(error.response?.data?.errors)?.messages ||
              `Erro ao ${editing ? "atualizar" : "cadastrar"} os dados. Entre em contato com o administrador do site ou tente novamente mais tarde.`,
            color: "red",
          }),
        )
        .finally(() => setIsSubmitting(false))
    }
  }

  const srcPicture =
    anuncioData?.foto?.indexOf("http") !== -1
      ? anuncioData?.foto
      : `${process.env.NEXT_PUBLIC_API_DOMAIN}/storage/premium/${anuncioData?.foto}`
  const srcPictureFile =
    form.values.foto && typeof form.values.foto !== "string"
      ? URL.createObjectURL(form.values.foto)
      : srcPicture || null

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} style={{ position: "relative" }}>
      <LoadingOverlay visible={isValidating} overlayProps={{ radius: "sm", blur: 2 }} />

      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack gap={5} align="center">
            <FileButton
              onChange={file => form.setFieldValue("foto", file)}
              accept="image/png,image/jpeg">
              {props => (
                <>
                  {srcPictureFile ? (
                    <Image alt="Foto" size="xl" {...props} src={srcPictureFile} />
                  ) : (
                    <IconCameraOff style={{ width: 100, height: 100 }} />
                  )}
                  <Text {...props} style={{ textWrap: "nowrap" }}>
                    {form.values.foto ? "Alterar foto" : "Selecionar foto"}
                  </Text>
                  <Text size="sm">721px x 157px</Text>
                </>
              )}
            </FileButton>
          </Stack>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Stack>
            <Grid>
              <Grid.Col span={6}>
                <Select
                  required
                  label="Tipo"
                  placeholder="Tipo"
                  data={[
                    { value: "1", label: "Anúncio grande 1" },
                    { value: "2", label: "Anúncio grande 2" },
                    { value: "3", label: "Anúncio pequeno 1" },
                    { value: "4", label: "Anúncio pequeno 2" },
                    { value: "5", label: "Anúncio pequeno 3" },
                  ]}
                  disabled={isSubmitting}
                  {...form.getInputProps("tipo")}
                />
              </Grid.Col>
              <Grid.Col span={12}>
                <Fields.AcompanhantesField
                  inputProps={{
                    ...form.getInputProps("acompanhante_id"),
                    data: optionsAcompanhantes,
                    disabled: isSubmitting,
                    required: true,
                    searchable: true,
                  }}
                />
              </Grid.Col>
            </Grid>
            <Grid>
              <Grid.Col span={6}>
                <Fields.DateField
                  inputProps={{
                    ...form.getInputProps("data_inicio"),
                    label: "Data Início",
                    disabled: isSubmitting,
                    required: true,
                  }}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <Fields.DateField
                  inputProps={{
                    ...form.getInputProps("data_fim"),
                    label: "Data Fim",
                    disabled: isSubmitting,
                    required: true,
                  }}
                />
              </Grid.Col>
              <Grid.Col span={4}>
                <Fields.StateField
                  inputProps={{
                    ...form.getInputProps("estado_id"),
                    data: optionsEstados,
                    disabled: isSubmitting,
                    searchable: true,
                  }}
                />
              </Grid.Col>
              <Grid.Col span={8}>
                {optionsCidades.length > 0 && (
                  <Fields.CityField
                    inputProps={{
                      ...form.getInputProps("cidade_id"),
                      data: optionsCidades,
                      disabled: !form.values.estado_id || isSubmitting,
                      searchable: true,
                    }}
                  />
                )}
              </Grid.Col>
              <Grid.Col span={6}>
                <Select
                  label="Ativo?"
                  placeholder="Ativo?"
                  data={[
                    { value: "1", label: "Sim" },
                    { value: "0", label: "Não" },
                  ]}
                  disabled={isSubmitting}
                  {...form.getInputProps("status")}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>
      </Grid>

      {!!error && (
        <Alert color="red" title="Erro">
          {error}
        </Alert>
      )}

      <Group mt="xl">
        <Button
          color="green"
          type="submit"
          size={isXs ? "sm" : "md"}
          fullWidth={!!isXs}
          disabled={!form.isValid() || !form.isDirty()}
          loading={isSubmitting}>
          Salvar
        </Button>
      </Group>
    </form>
  )
}
