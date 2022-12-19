import { useMirror } from '@lenskit/react'
import { Alert, Button, Card, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'

export default function CreateMirror() {
  const { mirror, publicationId, loading, error } = useMirror()
  const form = useForm({
    initialValues: {
      profileId: '0x530a',
      publicationId: '0x530a-0x08',
    },
  })

  return (
    <form onSubmit={form.onSubmit((values) => mirror(values.profileId, values.publicationId))}>
      <Card withBorder>
        <Stack spacing="md">
          <Title variant="gradient" gradient={{ from: 'lime', to: 'cyan', deg: 45 }} order={2}>
            Create Mirror
          </Title>
          <TextInput
            label="ProfileID"
            placeholder="0x530a"
            required
            {...form.getInputProps('profileId')}
          />
          <TextInput
            label="PublicationId"
            placeholder="0x530a-0x08"
            required
            {...form.getInputProps('publicationId')}
          />
          <Button
            variant="gradient"
            gradient={{ from: 'lime', to: 'cyan', deg: 45 }}
            w="full"
            type="submit"
            loading={loading}
          >
            Create
          </Button>
          {error && <Alert color="red">{error.message}</Alert>}
          {publicationId && (
            <Alert color="green" title="Publication ID">
              Create Mirror Success! Publication ID: {publicationId}
            </Alert>
          )}
        </Stack>
      </Card>
    </form>
  )
}
