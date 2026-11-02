"use client"

import {
  Button,
  Center,
  Loader,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconLogout, IconPlayerPause, IconPlayerPlay, IconTrash } from "@tabler/icons-react"
import { useEffect, useState } from "react"

import { errosDoFormulario, executar } from "@/components/minhaConta/acoes"
import Ajuda from "@/components/minhaConta/Ajuda"
import Confirmacao from "@/components/minhaConta/Confirmacao"
import Situacao from "@/components/minhaConta/Situacao"
import useMinhaConta from "@/components/minhaConta/useMinhaConta"
import { useAuth } from "@/providers/AuthProvider"
import { api } from "@/utils"

function DadosAcesso({ email, mutate }) {
  // Hooks
  const form = useForm({
    initialValues: { email: email || "", password: "", password_confirmation: "", senha_atual: "" },
    validate: {
      password: value => (value && value.length < 8 ? "Use pelo menos 8 caracteres" : null),
      password_confirmation: (value, values) =>
        value !== values.password ? "As senhas não são iguais" : null,
      senha_atual: value => (!value ? "Digite sua senha atual para confirmar" : null),
    },
  })

  // States
  const [salvando, setSalvando] = useState(false)

  // Effects
  useEffect(() => {
    if (email) form.setFieldValue("email", email)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  // Actions
  const salvar = async values => {
    setSalvando(true)
    const ok = await executar(() => api.patch("/api/minha-conta/acesso", values), {
      onErro: error => form.setErrors(errosDoFormulario(error)),
    })
    setSalvando(false)
    if (ok) {
      form.setValues({ email: values.email, password: "", password_confirmation: "", senha_atual: "" })
      mutate()
    }
  }

  return (
    <Paper withBorder radius="md" p="md">
      <Title order={4}>Dados de acesso</Title>
      <Text size="sm" c="dimmed" mb="sm">
        E-mail e senha que você usa para entrar no painel.
      </Text>
      <form onSubmit={form.onSubmit(salvar)}>
        <Stack gap="sm">
          <TextInput label="E-mail" type="email" size="md" {...form.getInputProps("email")} />
          <PasswordInput
            label="Nova senha"
            description="Deixe em branco para manter a senha atual"
            size="md"
            autoComplete="new-password"
            {...form.getInputProps("password")}
          />
          {form.values.password && (
            <PasswordInput
              label="Repita a nova senha"
              size="md"
              autoComplete="new-password"
              {...form.getInputProps("password_confirmation")}
            />
          )}
          <PasswordInput
            label="Senha atual"
            description="Por segurança, confirme com a senha que você usa hoje"
            size="md"
            autoComplete="current-password"
            {...form.getInputProps("senha_atual")}
          />
          <Button type="submit" size="md" color="pink" loading={salvando} fullWidth>
            Salvar dados de acesso
          </Button>
        </Stack>
      </form>
    </Paper>
  )
}

export default function Conta() {
  // Hooks
  const { conta, isLoading, mutate } = useMinhaConta()
  const { logout } = useAuth()

  // States
  const [pausando, setPausando] = useState(false)
  const [excluindo, setExcluindo] = useState(false)
  const [senhaExclusao, setSenhaExclusao] = useState("")
  const [erroExclusao, setErroExclusao] = useState(null)

  if (isLoading)
    return (
      <Center h={300}>
        <Loader color="pink" />
      </Center>
    )

  // Constants
  const pausada = conta?.situacao === "pausada"
  const exclusaoAgendada = conta?.situacao === "exclusao_agendada"
  const dias = conta?.dias_carencia_exclusao || 7

  // Actions
  const pausar = async () => {
    if (await executar(() => api.post("/api/minha-conta/pausar"))) {
      setPausando(false)
      mutate()
    }
  }
  const reativar = async () => {
    if (await executar(() => api.post("/api/minha-conta/reativar"))) mutate()
  }
  const excluir = async () => {
    setErroExclusao(null)
    const ok = await executar(
      () => api.post("/api/minha-conta/excluir", { senha_atual: senhaExclusao }),
      {
        sucesso: `Exclusão agendada. Você tem ${dias} dias para desistir.`,
        onErro: error => setErroExclusao(errosDoFormulario(error).senha_atual || null),
      },
    )
    if (ok) {
      setExcluindo(false)
      setSenhaExclusao("")
      mutate()
    }
  }

  return (
    <Stack>
      <Title order={3}>Minha conta</Title>

      {exclusaoAgendada ? (
        <Situacao conta={conta} mutate={mutate} />
      ) : (
        <>
          <Paper withBorder radius="md" p="md">
            <Title order={4}>Aparecer no site</Title>
            {pausada ? (
              <>
                <Text size="sm" my="sm">
                  Seu perfil está <strong>pausado</strong> e não aparece no site. Toque abaixo para
                  voltar a aparecer.
                </Text>
                <Button
                  size="md"
                  color="green"
                  leftSection={<IconPlayerPlay />}
                  onClick={reativar}
                  fullWidth>
                  Reativar meu perfil
                </Button>
              </>
            ) : (
              <>
                <Text size="sm" my="sm">
                  Vai dar um tempo? Pause seu perfil: ele sai do site, mas fotos, agenda e textos
                  ficam guardados para quando você voltar.
                </Text>
                <Button
                  size="md"
                  variant="light"
                  color="gray"
                  leftSection={<IconPlayerPause />}
                  onClick={() => setPausando(true)}
                  fullWidth>
                  Pausar meu perfil
                </Button>
              </>
            )}
          </Paper>

          <DadosAcesso email={conta?.email} mutate={mutate} />

          <Paper withBorder radius="md" p="md" style={{ borderColor: "var(--mantine-color-red-9)" }}>
            <Title order={4} c="red.5">
              Excluir minha conta
            </Title>
            <Text size="sm" my="sm">
              Parou de atender? Você pode excluir sua conta. Seu perfil sai do site na hora e todos
              os dados (fotos, vídeos, agenda e textos) são apagados para sempre depois de {dias}{" "}
              dias. Até lá, você pode desistir.
            </Text>
            <Button
              size="md"
              variant="light"
              color="red"
              leftSection={<IconTrash />}
              onClick={() => setExcluindo(true)}
              fullWidth>
              Excluir minha conta
            </Button>
          </Paper>
        </>
      )}

      <Button
        size="md"
        variant="default"
        leftSection={<IconLogout />}
        onClick={() => logout?.()}
        fullWidth>
        Sair do painel
      </Button>

      <Ajuda secao="conta" />

      <Confirmacao
        opened={pausando}
        onClose={() => setPausando(false)}
        onConfirm={pausar}
        titulo="Pausar perfil"
        mensagem="Seu perfil vai sair do site até você reativar. Nada será apagado. Continuar?"
        textoConfirmar="Sim, pausar"
        cor="gray"
      />

      <Confirmacao
        opened={excluindo}
        onClose={() => {
          setExcluindo(false)
          setSenhaExclusao("")
          setErroExclusao(null)
        }}
        onConfirm={excluir}
        titulo="Excluir conta"
        mensagem={`Seu perfil sai do site agora e seus dados serão apagados daqui a ${dias} dias (até lá, você pode desistir). Para confirmar, digite sua senha.`}
        textoConfirmar="Excluir minha conta">
        <PasswordInput
          label="Sua senha"
          size="md"
          autoComplete="current-password"
          value={senhaExclusao}
          error={erroExclusao}
          onChange={event => setSenhaExclusao(event.currentTarget.value)}
        />
      </Confirmacao>
    </Stack>
  )
}
