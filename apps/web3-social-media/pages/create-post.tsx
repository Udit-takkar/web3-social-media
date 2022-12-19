import CreatePost from '../components/CreatePost'
import { useAccount } from 'wagmi'
import { useProfileId } from '@lenskit/react'
export default function CreatePostComponent() {
  const { address, connector, isConnected } = useAccount()
  const { profileId } = useProfileId(address as string)
  return (
    <div className="flex w-full items-center justify-center">
      <div className="mx-8 w-full max-w-2xl ">
        {profileId && <CreatePost profileId={profileId} />}
      </div>
    </div>
  )
}
