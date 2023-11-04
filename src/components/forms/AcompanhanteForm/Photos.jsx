import { Stack } from '@mantine/core'
import React from 'react'

import * as Fields from './Fields'

export default function Photos({ onFileUpload }) {
  return (
    <Stack>
      <Fields.PictureField inputProps={{ onChange: onFileUpload }} />
    </Stack >
  )
}
