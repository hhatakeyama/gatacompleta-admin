import { Badge } from "@mantine/core"
import React from "react"

export default function Active({ status }) {
  return (
    <>
      {status === "1" ? (
        <Badge size="sm" color="green">
          Ativo
        </Badge>
      ) : (
        <Badge size="sm" color="red">
          Inativo
        </Badge>
      )}
    </>
  )
}
