import {
  PublicationTypes,
  usePublications,
  useProfile,
  useAuth,
  useProfileId,
} from '@lenskit/react'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'
import {
  Alert,
  Avatar,
  Card,
  Center,
  Group,
  Image,
  Input,
  Loader,
  Stack,
  Text,
  Title,
} from '@mantine/core'
export default function Posts() {
  const { auth, token, error: isis } = useAuth()
  const { address, connector, isConnected } = useAccount()
  const { profileId } = useProfileId(address as string)

  const {
    publications,
    loading: isLoading,
    error: PublicationError,
  } = usePublications(profileId, [PublicationTypes.Post])

  if (profileId === '' || !publications) return null
  return (
    <div className="mx-8">
      <Title
        order={1}
        variant="gradient"
        gradient={{ from: 'lime', to: 'cyan', deg: 45 }}
        sx={{ fontFamily: 'Greycliff CF, sans-serif' }}
        fz="xl"
        fw={700}
      >
        My Posts
      </Title>
      <div className="mt-2 flex flex-wrap">
        <Stack>
          {publications && publications.items.length > 0 ? (
            <div className="flex flex-col gap-2">
              {publications.items.map((publication, index) => (
                <div key={index}>
                  <Card withBorder radius="md">
                    <Text weight={500} component="a" className="mt-5 mb-2 block">
                      {publication?.metadata.name}
                    </Text>

                    <Text size="sm" color="dimmed" lineClamp={4}>
                      {publication?.metadata.content}
                    </Text>

                    <Group position="apart" className="mt-5">
                      <Center>
                        <Avatar src="lens/lens-logo.svg" size={24} radius="xl" mr="xs" />
                        <Text size="sm" inline>
                          {publication?.profile.name}
                        </Text>
                      </Center>
                    </Group>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <Alert color="red">No publications found</Alert>
          )}
          {isLoading && <Loader />}
          {PublicationError && <Alert color="red">{PublicationError.message}</Alert>}
        </Stack>
      </div>
    </div>
  )
}
