import { useDefaultProfileQuery } from 'generated-gql'
import { useEffect, useState } from 'react'

export function useProfileId(ethereumAddress: string) {
  const [profileId, setProfileId] = useState('')
  const { data, loading, error } = useDefaultProfileQuery({
    variables: {
      request: {
        ethereumAddress,
      },
    },
  })

  useEffect(() => {
    if (data?.defaultProfile?.id) {
      setProfileId(data?.defaultProfile?.id)
    }
  }, [data])

  return {
    profileId: profileId,
    loading,
    error,
  }
}
