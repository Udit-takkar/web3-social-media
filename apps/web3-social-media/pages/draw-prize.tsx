import { Alert, Card, Input, Title } from '@mantine/core'
import { Button, Stack, SimpleGrid, Text } from '@mantine/core'
import { useEffect, useState } from 'react'
import tokenContract from '../contracts/PrizeDrawModule.json'
import { useProvider, useSigner } from 'wagmi'
import { ethers } from 'ethers'

import Confetti from 'react-confetti'

// const CONTRACT_ADDRESS = '0xd528ec3ccda4ef667a42c6d744c0c2ff49d071be'
const CONTRACT_ADDRESS = '0x11ADBcCefb0e8C325e427F21c24e845FA751054A'

const contractConfig = {
  addressOrName: CONTRACT_ADDRESS,
  contractInterface: tokenContract.abi,
}

const DrawPrize = () => {
  const { data: signer, isError, isLoading } = useSigner({ chainId: 80001 })

  const [handle, setHandle] = useState<string>('')
  const [amount, setAmount] = useState(0.001)
  const [followers, setFollowers] = useState([])
  const [profileId, setProfileID] = useState('')
  const provider = useProvider()
  const [luckyDrawLoading, setLuckyDrawLoading] = useState(false)
  const [giveawayResult, setGiveawayResult] = useState<{ winner: string; eth: string } | null>(null)

  const { width, height } = useWindowSize()

  useEffect(() => {
    const setEventListener = async () => {
      const provider = new ethers.providers.WebSocketProvider(
        'wss://ws-matic-mumbai.chainstacklabs.com'
      )

      const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, tokenContract.abi, provider)
      contractInstance.on('SendPrize', (from, to, value, event) => {
        let transferEvent = {
          from: from,
          to: to,
          value: value,
          eventData: event,
        }

        setGiveawayResult({
          winner: to,
          eth: ethers.utils.formatEther(value.toString()),
        })

        console.log({
          winner: to,
          eth: ethers.utils.formatEther(value.toString()),
        })
        setLuckyDrawLoading(false)
      })
    }

    setEventListener()
  }, [])

  return (
    <div className="mx-4">
      <SimpleGrid cols={2}>
        <div>
          <Card p="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title variant="gradient" gradient={{ from: 'lime', to: 'cyan', deg: 45 }} order={2}>
                Show Followers
              </Title>
              <Input
                placeholder={'Enter a handle'}
                value={handle}
                onChange={(e: any) => setHandle(e.target.value)}
              />
              <Button
                variant="gradient"
                gradient={{ from: 'lime', to: 'cyan', deg: 45 }}
                onClick={async () => {
                  try {
                    const _handle = handle
                    const contractInstance = new ethers.Contract(
                      CONTRACT_ADDRESS,
                      tokenContract.abi,
                      provider
                    )
                    const profileId = await contractInstance.getProfileIdByHandle(_handle)
                    const _profileId = profileId.toNumber()
                    setProfileID(_profileId)
                    const followerResult = await contractInstance.getFollower(_profileId)
                    const uniqueFOllowers = followerResult.filter(
                      (item: string, index: number) => followerResult.indexOf(item) === index
                    )
                    setFollowers(uniqueFOllowers)
                  } catch (err) {
                    console.log(err)
                  }
                }}
              >
                Get Followers
              </Button>
              {/* {profileId && <Alert color="green">Profile created: {profileId}</Alert>} */}
              {/* {error && <Alert color="red">{error.message}</Alert>} */}
            </Stack>
          </Card>
          <div className="mx-2">
            {followers.length === 0
              ? 'This profile does not have any followers. Please select another profile.'
              : followers.length + ' followers:'}
            {followers.length > 0 &&
              followers.map((follower) => {
                return (
                  <Text key={follower} className="my-1" size="md" color="dimmed" lineClamp={4}>
                    {follower}
                  </Text>
                )
              })}
          </div>
        </div>
        <div>
          <Card p="lg" radius="md" withBorder>
            <Stack spacing="md">
              <Title variant="gradient" gradient={{ from: 'lime', to: 'cyan', deg: 45 }} order={2}>
                Enter Amount in MATIC
              </Title>
              <Input
                type="number"
                placeholder={'Enter amount in MATIC'}
                value={amount}
                onChange={(e: any) => setAmount(e.target.value)}
              />
              <Button
                variant="gradient"
                gradient={{ from: 'lime', to: 'cyan', deg: 45 }}
                loading={luckyDrawLoading}
                onClick={async () => {
                  if (signer) {
                    try {
                      setLuckyDrawLoading(true)
                      const contractInstance = new ethers.Contract(
                        CONTRACT_ADDRESS,
                        tokenContract.abi,
                        signer
                      )
                      const price = ethers.utils.parseEther(amount.toString())
                      const transaction = await contractInstance.createGiveaway(profileId, {
                        value: 1000000000000000,
                        gasLimit: 1000000,
                      })
                      const tx = await transaction.wait()
                      console.log(tx)
                    } catch (err) {
                      console.log(err)
                    }
                  }
                }}
              >
                Start Lucky Draw
              </Button>
            </Stack>
          </Card>
          {giveawayResult && (
            <Text className="my-1" size="md" lineClamp={4}>
              {giveawayResult?.winner} won {giveawayResult?.eth} MATIC
            </Text>
          )}
        </div>
      </SimpleGrid>
      {giveawayResult ? <Confetti width={width} height={height} /> : ''}
    </div>
  )
}

// Hook
function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  })
  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    // Add event listener
    window.addEventListener('resize', handleResize)
    // Call handler right away so state gets updated with initial window size
    handleResize()
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize)
  }, []) // Empty array ensures that effect is only run on mount
  return windowSize
}

export default DrawPrize
