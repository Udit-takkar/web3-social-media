import { useSetProfileMetadata, useProfile } from '@lenskit/react'
import { Alert, Button, Card, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useRouter } from 'next/router'
import { css } from '@emotion/css'
import { v4 as uuidv4 } from 'uuid'

export default function EditProfileById() {
    const router = useRouter();
    const profileId = router.query.id;
    const { profile } = useProfile(profileId as string || "");
    const { setProfileMetadata, tx, loading, error } = useSetProfileMetadata()

    const form = useForm({
        initialValues: {
            profileId: router.query.id,
            name: profile?.name || '',
            bio: profile?.bio || '',
        },
    })

    const handleUpdateProfile = async (values: any) => {
        const profileMetadata = {
            version: '1.0.0',
            metadata_id: uuidv4(),
            name: values.name,
            bio: values.bio,
            cover_picture: 'https://picsum.photos/200/300',
            attributes: [
                {
                    traitType: 'string',
                    value: 'yes this is custom',
                    key: 'custom_field',
                },
            ],
        }
        await setProfileMetadata(values.profileId, profileMetadata)
    }

    return (
        <div className={searchContainerStyleWrapper}>
            <form onSubmit={form.onSubmit(handleUpdateProfile)}>
                <Card >
                    <Stack spacing="xl">
                        <Title variant="gradient" gradient={{ from: 'purple', to: 'cyan', deg: 45 }} order={2}>
                            Edit Lens Profile
                        </Title>
                        <TextInput
                            label="Profile ID"
                            placeholder="0x530a"
                            required
                            {...form.getInputProps('profileId')}
                        />
                        <TextInput label="Name" placeholder="lenskit" required {...form.getInputProps('name')} />
                        <TextInput
                            label="Bio"
                            placeholder="lenskit playground"
                            required
                            {...form.getInputProps('bio')}
                        />
                        <Button
                            variant="gradient"
                            gradient={{ from: 'purple', to: 'cyan', deg: 45 }}
                            w="full"
                            type="submit"
                            loading={loading && !error}
                        >
                            Submit
                        </Button>
                        {error && <Alert color="red">{error.message}</Alert>}
                        {tx && <Alert color="green">Profile updated: {tx.transactionHash}</Alert>}
                    </Stack>
                </Card>
            </form>
        </div>

    )
}


const searchContainerStyleWrapper = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: -120px;
    margin-bottom: 120px;
`