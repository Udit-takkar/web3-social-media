// @ts-nocheck
import { useProfile, useProfileId } from '@lenskit/react'
import { useAccount } from 'wagmi'
import myLoader from '../assets/Loader.gif';
import ProfilePicture from '../assets/ProfilePicture.png';
import { css } from '@emotion/css'
import Image from 'next/image'
import { Button } from '@mantine/core'
import { useRouter } from 'next/router'

export default function Home() {
    const { address } = useAccount()
    const { profileId } = useProfileId(address as string)
    const { profile, loading } = useProfile(profileId)
    const router = useRouter()

    return (
        <div>
            <div className={searchContainerStyleWrapper}>
                {
                    loading ?
                        (
                            <Image
                                src={myLoader}
                                alt="Picture of the author"
                                width={200}
                            />
                        ) :
                        (
                            <div className={containerStyle}>
                                <div
                                    className={css`
                                    ${headerstyle};
                                    background-image: url(${profile?.coverPicture?.original.url || ""});
                                    background-color: white;
                                    `}
                                >
                                </div>
                                <div className={columnWrapperStyle}>
                                    <div>
                                        <Image
                                            alt={`Picture of the ${profile?.name || ""}`}
                                            className={css`${profileimageStyle};`}
                                            src={profile?.picture?.original?.url || ProfilePicture}
                                        />
                                        <h3 className={namestyle}>{profile?.name || ""}</h3>
                                        <p className={handlestyle}>{profile?.handle || ""}</p>
                                        <p className={bioStyle}>{profile?.bio || ""}</p>
                                    </div>
                                    <div className={rightColumnStyle}>
                                        <h3 className={postHeaderStyle}>Posts</h3>
                                        <div className={emptyPostContainerStyle}>
                                            <p className={emptyPostTextStyle}>
                                                <span className={emptyPostHandleStyle}>{profile?.handle || ""}</span> has not posted yet!
                                            </p>
                                        </div>
                                        <div className={editButtonWrapper}>
                                            <Button
                                                variant="gradient"
                                                gradient={{ from: 'purple', to: 'cyan', deg: 45 }}
                                                loading={loading}
                                                size="xs"
                                                mt="sm"
                                                onClick={() => router.push(`/edit-profile/${profileId}`)}
                                            >
                                                Edit Profile
                                            </Button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        )
                }
            </div>
        </div>
    )
}

const editButtonWrapper = css`
    width: 100%;
    display: flex;
    justify-content: flex-end;
`

const bioStyle = css`
  font-weight: 500;
`

const emptyPostTextStyle = css`
  text-align: center;
  margin: 0;
`

const emptyPostContainerStyle = css`
  background-color: white;
  border: 1px solid rgba(0, 0, 0, .15);
  padding: 25px;
  border-radius: 8px;
`

const emptyPostHandleStyle = css`
  font-weight: 600;
`

const postHeaderStyle = css`
  margin: 0px 0px 15px;
`

const namestyle = css`
  margin: 15px 0px 5px;
`

const handlestyle = css`
  margin: 0px 0px 5px;
  color: #b900c9;
`

const headerstyle = css`
  width: 900px;
  max-height: 300px;
  height: 300px;
  overflow: hidden;
  object-fit: contain;
  background-size: cover;
  background-position: center;
`

const profileimageStyle = css`
  width: 200px;
  height: 200px;
  max-width: 200px;
  border: 1px solid black;
  border-radius: 12px;
`

const columnWrapperStyle = css`
  margin-top: 20px;
  display: flex;
  flex-direction: row;
`

const rightColumnStyle = css`
  margin-left: 20px;
  flex: 1;
`

const containerStyle = css`
  padding-top: 50px;
`

const searchContainerStyleWrapper = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: -120px;
    margin-bottom: 120px;
`