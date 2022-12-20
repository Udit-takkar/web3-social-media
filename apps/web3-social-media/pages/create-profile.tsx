import { useCreateProfile, useProfile } from '@lenskit/react'
import { Button, Stack } from '@mantine/core'
import { useState } from 'react'
import { css } from '@emotion/css'
import { useRouter } from 'next/router'

import { Alert, Group, Card, Input, Title, Text, Avatar } from '@mantine/core'

export default function CreateProfile(): JSX.Element {
    const { createProfile, profileId, loading, error } = useCreateProfile();
    const { profile } = useProfile(profileId || "");
    const [handle, setHandle] = useState('')
    const router = useRouter()

    return (
        <div className={searchContainerStyleWrapper}>
            <Card p="lg" radius="md">
                <Title variant="gradient" gradient={{ from: 'purple', to: 'cyan', deg: 45 }} order={2}>
                    Create Profile
                </Title>
                <Group position="apart" mt="md" mb="xs">
                    <Input
                        placeholder={'Enter a handle'}
                        value={handle}
                        size="lg"
                        onChange={(e: any) => setHandle(e.target.value)}
                    />
                    <Button
                        variant="gradient"
                        gradient={{ from: 'purple', to: 'cyan', deg: 45 }}
                        loading={loading}
                        size="md"
                        onClick={() => createProfile(handle)}
                    >
                        Create
                    </Button>
                </Group>
                <Stack spacing="md">
                    {profileId && <Alert color="green">Profile created: {profileId}</Alert>}
                    {error && <Alert color="red">{error.message}</Alert>}
                </Stack>
                {
                    profileId && (
                        <Stack m="lg">
                            {profile && (
                                <Group>
                                    <Avatar src={'/lens/lens-logo.svg'} size={94} radius="md" />
                                    <div>
                                        <Text size="lg" sx={{ textTransform: 'uppercase' }} weight={1000} color="dimmed">
                                            {profile.name}
                                        </Text>

                                        <Text size="lg" weight={500}>
                                            {profile.bio}
                                        </Text>

                                        <Group noWrap spacing={10} mt={3}>
                                            <Text size="lg" color="dimmed">
                                                {profile.handle}
                                            </Text>
                                        </Group>

                                        <Group noWrap spacing={10} mt={5}>
                                            <Text size="xs" color="dimmed">
                                                {shortAddress(profile.ownedBy)}
                                            </Text>
                                        </Group>
                                    </div>
                                    <Button
                                        variant="gradient"
                                        gradient={{ from: 'purple', to: 'cyan', deg: 45 }}
                                        loading={loading}
                                        size="xs"
                                        onClick={() => router.push(`/edit-profile/${profileId}`)}
                                    >
                                        Edit Profile
                                    </Button>
                                </Group>
                            )}
                        </Stack>
                    )
                }
            </Card>
        </div>

    )
}

function shortAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const searchContainerStyleWrapper = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: -120px;
    margin-bottom: 120px;
`
