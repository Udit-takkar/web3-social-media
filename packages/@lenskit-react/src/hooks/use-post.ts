import { BigNumber, utils } from 'ethers'
import { useCreatePostTypedDataMutation } from 'generated-gql'
import { useEffect, useState } from 'react'
import { Metadata } from 'types/publication'
import { getAddressFromSigner, signedTypeData, splitSignature } from 'utils/ethers.service'
import { uploadIpfs } from 'utils/ipfs'
import { getLensHub } from 'utils/lens-hub'
import { useAuth } from './use-auth'
import { useIndexedTx } from './use-indexed-tx'

export function usePost() {
  const [publicationId, setPublicationId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [createPostTypedDataMutation] = useCreatePostTypedDataMutation()
  const { auth: login } = useAuth()
  const [txHash, setTxHash] = useState<string | null>(null)
  const { tx, error: indexError } = useIndexedTx(txHash)

  const post = async (profileId: string, metadata: Metadata) => {
    try {
      const address = await getAddressFromSigner()
      await login(address)
      const ipfsResult = await uploadIpfs<Metadata>(metadata)
      // TODO: let user can custom module
      const createPostRequest = {
        profileId,
        contentURI: 'ipfs://' + ipfsResult.path,
        collectModule: {
          // feeCollectModule: {
          //   amount: {
          //     currency: currencies.enabledModuleCurrencies.map(
          //       (c: any) => c.address
          //     )[0],
          //     value: '0.000001',
          //   },
          //   recipient: address,
          //   referralFee: 10.5,
          // },
          // revertCollectModule: true,
          freeCollectModule: { followerOnly: false },
          // limitedFeeCollectModule: {
          //   amount: {
          //     currency: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
          //     value: '2',
          //   },
          //   collectLimit: '20000',
          //   recipient: '0x3A5bd1E37b099aE3386D13947b6a90d97675e5e3',
          //   referralFee: 0,
          // },
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      }
      const result = await createPostTypedDataMutation({
        variables: {
          request: createPostRequest,
        },
      })

      const typedData = result.data!.createPostTypedData.typedData
      const signature = await signedTypeData(typedData.domain, typedData.types, typedData.value)
      const { v, r, s } = splitSignature(signature)
      const tx = await getLensHub().postWithSig({
        profileId: typedData.value.profileId,
        contentURI: typedData.value.contentURI,
        collectModule: typedData.value.collectModule,
        collectModuleInitData: typedData.value.collectModuleInitData,
        referenceModule: typedData.value.referenceModule,
        referenceModuleInitData: typedData.value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      })
      console.log('create post: tx hash', tx.hash)
      setTxHash(tx.hash)
    } catch (e: any) {
      setError(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tx) {
      const logs = tx.logs
      const topicId = utils.id(
        'PostCreated(uint256,uint256,string,address,bytes,address,bytes,uint256)'
      )
      const profileCreatedLog = logs.find((l: any) => l.topics[0] === topicId)
      let profileCreatedEventLog = profileCreatedLog!.topics
      const publicationId = utils.defaultAbiCoder.decode(['uint256'], profileCreatedEventLog[2])[0]
      setPublicationId(BigNumber.from(publicationId).toHexString())
      setLoading(false)
    }
  }, [tx])

  return { post, publicationId, loading, error: error || indexError }
}
