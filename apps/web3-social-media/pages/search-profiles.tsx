// @ts-nocheck
import { useState, useEffect } from 'react'
import { useProfile, useFollow, useUnfollow } from '@lenskit/react'
import myLoader from '../assets/Loader.gif';
import ProfilePicture from '../assets/ProfilePicture.png';
import { css } from '@emotion/css'
import { Button, SearchInput } from '../LooseComponents';
import Image from 'next/image'

export default function Home() {
  const [searchString, setSearchString] = useState('0x530a')
  const { profile, loading, error } = useProfile(searchString)
  const { follow, tx: FollowTx, loading: FollowLoading } = useFollow();
  const { unfollow, tx: UnFollowTx, loading: UnfollowLoading } = useUnfollow();
  return (
    <div>
      <div className={searchContainerStyleWrapper}>
        <div className={searchContainerStyle}>
          <SearchInput
            placeholder='Search'
            // @ts-ignore
            onChange={e => { setSearchString(e.target.value) }}
            value={searchString}
          />
          <Button
            buttonText="SEARCH PROFILES"
          />
        </div>
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
                                    background-image: url(${profile.coverPicture?.original.url});
                                    background-color: white;
                                    `}
                >
                </div>
                <div className={columnWrapperStyle}>
                  <div>
                    <Image
                      alt={`Picture of the ${profile.name}`}
                      className={css`${profileimageStyle};`}
                      src={profile?.picture?.original?.url || ProfilePicture}
                    />
                    <h3 className={namestyle}>{profile.name}</h3>
                    <p className={handlestyle}>{profile.handle}</p>
                    <p className={bioStyle}>{profile.bio}</p>
                    <div>
                      {
                        FollowTx ? (
                          <button
                            onClick={() => unfollow(searchString)}
                            className={buttonStyle}
                          >{UnfollowLoading ? (<Image
                            src={myLoader}
                            alt="Picture of the author"
                            width={50}

                          />) : "UnFollow"}</button>
                        ) : (
                          <button
                            onClick={() => follow(searchString)}
                            className={buttonStyle}
                            disabled={FollowLoading}
                          >{FollowLoading ? (<Image
                            src={myLoader}
                            alt="Picture of the author"
                            width={50}

                          />) : "Follow"}
                          </button>
                        )
                      }
                    </div>
                  </div>
                  <div className={rightColumnStyle}>
                    <h3 className={postHeaderStyle}>Posts</h3>
                    <div className={emptyPostContainerStyle}>
                      <p className={emptyPostTextStyle}>
                        <span className={emptyPostHandleStyle}>{profile.handle}</span> has not posted yet!
                      </p>
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

const buttonStyle = css`
  border: 2px solid rgb(249, 92, 255);
  outline: none;
  margin-top: 15px;
  color: rgb(249, 92, 255);
  padding: 13px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all .35s;
  font-weight: 700;
  width: 100%;
  letter-spacing: .75px;
  &:hover {
    background-color: rgb(249, 92, 255);
    color: white;
  }
`

const searchContainerStyleWrapper = css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: -120px;
    margin-bottom: 120px;
`

const searchContainerStyle = css`
  padding: 40px 0px 30px;
`