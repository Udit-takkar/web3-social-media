import { PublicationMainFocus, useComment } from '@lenskit/react'
import { Alert, Button, Card, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { v4 as uuidv4 } from 'uuid'

export default function CreateComment() {
  const { comment, publicationId, loading, error } = useComment()
  const form = useForm({
    initialValues: {
      version: '2.0.0',
      mainContentFocus: PublicationMainFocus.TEXT_ONLY,
      metadata_id: uuidv4(),
      name: 'testing',
      description: 'testing comment',
      locale: 'en-US',
      content:
        'Comments allow users to provide additional commentary  on other publications.They are treated the same as base [Publications](https://docs.lens.xyz/docs/publication) with extra checks and features. ',
      external_url: '',
      image: null,
      imageMimeType: null,
      attributes: [],
      tags: ['testing'],
      appId: 'testing-github',

      profileId: '0x530a',
      publicationId: '0x530a-0x08',
    },
  })

  const handleComment = async (values: any) => {
    const commentMetadata = {
      version: '2.0.0',
      mainContentFocus: PublicationMainFocus.TEXT_ONLY,
      metadata_id: uuidv4(),
      name: values.name,
      description: values.description,
      content: values.content,
      locale: 'en-US',
      external_url: values.external_url,
      image: values.image,
      imageMimeType: values.imageMimeType,
      attributes: [],
      tags: ['testing'],
      appId: 'testing-github',
    }
    await comment(values.profileId, values.publicationId, commentMetadata)
  }

  return (
    <form onSubmit={form.onSubmit(handleComment)}>
      <Card withBorder>
        <Stack spacing="md">
          <Title variant="gradient" gradient={{ from: 'lime', to: 'cyan', deg: 45 }} order={2}>
            Comment
          </Title>
          <TextInput
            label="ProfileID"
            placeholder="0x530a"
            required
            {...form.getInputProps('profileId')}
          />
          <TextInput
            label="PublicationID"
            placeholder="0x530a"
            required
            {...form.getInputProps('publicationId')}
          />
          <TextInput label="Name" placeholder="lenskit" required {...form.getInputProps('name')} />
          <TextInput
            label="Description"
            placeholder="testing playground"
            required
            {...form.getInputProps('description')}
          />
          <TextInput
            label="Content"
            placeholder="testing playground"
            required
            {...form.getInputProps('content')}
          />
          <TextInput
            label="External URL"
            placeholder="testing playground"
            {...form.getInputProps('external_url')}
          />
          <Button
            variant="gradient"
            gradient={{ from: 'lime', to: 'cyan', deg: 45 }}
            w="full"
            type="submit"
            loading={loading && !error}
          >
            Submit
          </Button>
          {error && <Alert color="red">{error.message}</Alert>}
          {publicationId && (
            <Alert color="green" title="Publication ID">
              Create Post Success! Publication ID: {publicationId}
            </Alert>
          )}
        </Stack>
      </Card>
    </form>
  )
}
