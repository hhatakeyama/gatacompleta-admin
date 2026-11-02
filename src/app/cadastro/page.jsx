"use client"

import {
  Alert,
  Anchor,
  Button,
  Center,
  Checkbox,
  Container,
  InputBase,
  Loader,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconBrandWhatsapp } from "@tabler/icons-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"

import { errosDoFormulario, linkSuporte, mensagemErro } from "@/components/minhaConta/acoes"
import { useFetch } from "@/hooks"
import { useAuth } from "@/providers/AuthProvider"
import { api } from "@/utils"

import logo from "../../../public/logo.jpg"

const urlPoliticas = "https://gatacompleta.com/politicas"

/**
 * Cadastro da acompanhante pelo site. Sem link no painel nem no site enquanto estiver em validação;
 * a API só aceita quando CADASTRO_ACOMPANHANTE estiver "convite" (com código) ou "aberto".
 */
export default function Cadastro() {
  // Hooks
  const router = useRouter()
  const { isAuthenticated, saveToken } = useAuth()

  // States
  const [erro, setErro] = useState(null)
  const [enviando, setEnviando] = useState(false)

  // Fetch
  const { data: disponibilidade, error: erroDisponibilidade } = useFetch(["/minha-conta/cadastro"])
  const { data: tipos } = useFetch(["/busca/tipos"])

  // Form
  const form = useForm({
    initialValues: {
      name: "",
      tipo_id: null,
      telefone: "",
      whatsapp: true,
      email: "",
      password: "",
      password_confirmation: "",
      codigo_convite: "",
      maior_idade: false,
      termos: false,
    },
    validate: {
      name: value => (value.trim().length < 2 ? "Digite seu nome artístico" : null),
      tipo_id: value => (!value ? "Escolha uma categoria" : null),
      telefone: value => (value.replace(/\D/g, "").length < 10 ? "Digite o telefone com DDD" : null),
      email: value => (/^\S+@\S+\.\S+$/.test(value) ? null : "Digite um e-mail válido"),
      password: value => (value.length < 8 ? "A senha precisa ter pelo menos 8 caracteres" : null),
      password_confirmation: (value, values) =>
        value !== values.password ? "As senhas não são iguais" : null,
      codigo_convite: value =>
        disponibilidade?.exige_convite && !value ? "Digite o código de convite" : null,
      maior_idade: value => (!value ? "Obrigatório" : null),
      termos: value => (!value ? "Obrigatório" : null),
    },
  })

  // Effects
  // Quem já está logado vai direto para o painel
  useEffect(() => {
    if (isAuthenticated === true && !enviando) router.replace("/minha-conta")
  }, [enviando, isAuthenticated, router])

  // Actions
  const cadastrar = async values => {
    setErro(null)
    setEnviando(true)
    try {
      const { data } = await api.post("/api/minha-conta/cadastro", values)
      saveToken(data.token)
      router.replace("/minha-conta")
    } catch (error) {
      form.setErrors(errosDoFormulario(error))
      setErro(mensagemErro(error, "Não foi possível fazer o cadastro. Tente novamente."))
      setEnviando(false)
    }
  }

  // Constants
  const opcoesTipos = tipos?.map(tipo => ({ value: tipo.id.toString(), label: tipo.nome })) || []

  const conteudo = () => {
    if (!disponibilidade && !erroDisponibilidade)
      return (
        <Center h={200}>
          <Loader color="pink" />
        </Center>
      )

    if (!disponibilidade?.disponivel)
      return (
        <Stack>
          <Text>O cadastro pelo site ainda não está disponível.</Text>
          <Text size="sm">Para anunciar no Gata Completa, fale com a nossa equipe pelo WhatsApp.</Text>
          <Button
            component="a"
            href={linkSuporte("Olá, quero anunciar no GataCompleta.com")}
            color="green"
            size="md"
            leftSection={<IconBrandWhatsapp />}>
            Falar com a equipe
          </Button>
        </Stack>
      )

    return (
      <form onSubmit={form.onSubmit(cadastrar)}>
        <Stack>
          <TextInput
            label="Nome artístico"
            description="É o nome que aparece no site"
            size="md"
            maxLength={60}
            {...form.getInputProps("name")}
          />
          <Select
            label="Categoria"
            placeholder="Toque para escolher"
            size="md"
            data={opcoesTipos}
            {...form.getInputProps("tipo_id")}
          />
          <InputBase
            label="Telefone com DDD"
            description="Aparece no botão de contato do seu perfil"
            placeholder="(11) 999999999"
            type="tel"
            size="md"
            component={IMaskInput}
            mask="(00) 000000000"
            {...form.getInputProps("telefone")}
            onChange={undefined}
            onAccept={value => form.setFieldValue("telefone", value)}
          />
          <Switch
            label="Este número tem WhatsApp"
            size="md"
            {...form.getInputProps("whatsapp", { type: "checkbox" })}
          />
          <TextInput
            label="E-mail"
            description="Você vai usar para entrar no painel"
            type="email"
            size="md"
            autoComplete="email"
            {...form.getInputProps("email")}
          />
          <PasswordInput
            label="Senha"
            description="Pelo menos 8 caracteres"
            size="md"
            autoComplete="new-password"
            {...form.getInputProps("password")}
          />
          <PasswordInput
            label="Repita a senha"
            size="md"
            autoComplete="new-password"
            {...form.getInputProps("password_confirmation")}
          />
          {disponibilidade?.exige_convite && (
            <TextInput
              label="Código de convite"
              description="Código enviado pela equipe do Gata Completa"
              size="md"
              {...form.getInputProps("codigo_convite")}
            />
          )}
          <Checkbox
            size="md"
            label="Declaro que tenho 18 anos ou mais"
            {...form.getInputProps("maior_idade", { type: "checkbox" })}
          />
          <Checkbox
            size="md"
            label={
              <>
                Li e aceito os{" "}
                <Anchor href={urlPoliticas} target="_blank" rel="noreferrer">
                  termos e políticas
                </Anchor>{" "}
                do Gata Completa
              </>
            }
            {...form.getInputProps("termos", { type: "checkbox" })}
          />

          {erro && (
            <Alert color="red" radius="md">
              {erro}
            </Alert>
          )}

          <Button type="submit" size="lg" color="pink" loading={enviando} fullWidth>
            Criar minha conta
          </Button>
          <Text size="xs" c="dimmed" ta="center">
            Seu perfil aparece no site depois que a nossa equipe aprovar o cadastro.
          </Text>
        </Stack>
      </form>
    )
  }

  return (
    <Container size={480} px="md" py="xl">
      <Center mb="lg">
        <Image alt="Gata Completa" src={logo} width="auto" height={48} unoptimized />
      </Center>
      <Title order={2} ta="center">
        Anuncie no Gata Completa
      </Title>
      <Text c="dimmed" size="sm" ta="center" mb="lg">
        Crie sua conta e gerencie seu anúncio pelo celular.
      </Text>

      <Paper withBorder radius="md" p="lg">
        {conteudo()}
      </Paper>

      <Text size="sm" ta="center" mt="lg">
        Já tem conta?{" "}
        <Anchor component={Link} href="/accounts/login">
          Entrar
        </Anchor>
      </Text>
    </Container>
  )
}
