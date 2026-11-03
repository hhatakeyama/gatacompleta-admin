"use client"

import { Badge, Button, Card, Image, Menu } from "@mantine/core"
import {
  IconArrowLeft,
  IconArrowRight,
  IconDots,
  IconRotate,
  IconRotateClockwise,
  IconStar,
  IconTrash,
} from "@tabler/icons-react"

import { urlMidia } from "@/components/minhaConta/acoes"

/**
 * Foto com as ações em um menu com texto (mais fácil de entender do que só ícones).
 */
export default function FotoCard({ foto, posicao, total, onAcao }) {
  return (
    <Card withBorder radius="md" p={6}>
      <Card.Section pos="relative">
        <Image
          src={urlMidia(foto.path, foto.nome, "210x314-")}
          alt={`Foto ${posicao + 1}`}
          h={220}
          fit="cover"
        />
        <div style={{ position: "absolute", top: 6, left: 6, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {foto.destaque && (
            <Badge color="pink" leftSection={<IconStar size={12} />}>
              Capa
            </Badge>
          )}
          {!foto.aprovada && <Badge color="yellow">Aguardando aprovação</Badge>}
        </div>
      </Card.Section>

      <Menu position="bottom" withinPortal width={230}>
        <Menu.Target>
          <Button variant="default" fullWidth mt={6} leftSection={<IconDots size={18} />}>
            Opções
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          {!foto.destaque && (
            <Menu.Item leftSection={<IconStar size={18} />} onClick={() => onAcao("capa", foto)}>
              Usar como capa
            </Menu.Item>
          )}
          {posicao > 0 && (
            <Menu.Item leftSection={<IconArrowLeft size={18} />} onClick={() => onAcao("frente", foto)}>
              Mover para frente
            </Menu.Item>
          )}
          {posicao < total - 1 && (
            <Menu.Item leftSection={<IconArrowRight size={18} />} onClick={() => onAcao("tras", foto)}>
              Mover para trás
            </Menu.Item>
          )}
          <Menu.Item leftSection={<IconRotate size={18} />} onClick={() => onAcao("esquerda", foto)}>
            Girar para a esquerda
          </Menu.Item>
          <Menu.Item
            leftSection={<IconRotateClockwise size={18} />}
            onClick={() => onAcao("direita", foto)}>
            Girar para a direita
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" leftSection={<IconTrash size={18} />} onClick={() => onAcao("remover", foto)}>
            Remover foto
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </Card>
  )
}
