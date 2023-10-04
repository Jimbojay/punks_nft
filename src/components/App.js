import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import { ethers } from 'ethers'

// IMG
import preview from '../preview.png'

// Components
import Navigation from './Navigation';
import Data from './Data';
import Mint from './Mint';
import Loading from './Loading';
import NFTMetadata from './NFTMetadata';

// ABIs: Import your contract ABIs here
import NFT_ABI from '../abis/NFT.json'

// Config: Import your network config here
import config from '../config.json';

function App() {
  const [provider, setProvider] = useState(null)
  const [nft, setNFT] = useState(null)

  const [account, setAccount] = useState(null)

  const [revealTime, setRevealTime]  = useState(0)
  const [maxSupply, setMaxSupply] = useState(0)
  const [totalSupply, setTotalSupply] = useState(0)
  const [cost, setCost]  = useState(0)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const [lastNFT, setLastNFT] = useState(null)
  const [tokenIds, setTokenIds] = useState(null);

  const [_NFTMetadata, setNFTMetadata] = useState(null);
  const [isPauzed, setIsPauzed] = useState(false);

  let items = [];

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    // Initiate contract
    const nft = new ethers.Contract(config[31337].nft.address, NFT_ABI, provider)
    setNFT(nft)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch Countdown
    const allowMintingOn = await nft.allowMintingOn()
    setRevealTime(allowMintingOn.toString() + '000')

    setMaxSupply(await nft.maxSupply())

    setTotalSupply(await nft.totalSupply())

    setCost(await nft.cost())

    setBalance(await nft.balanceOf(account))

    // Fetch owned NFTs
    let tokenIds = await nft.walletOfOwner(account)
    setTokenIds(tokenIds);

    // Fetch last bought NFT
    setLastNFT(tokenIds[tokenIds.length - 1]);

    // Fetch metadata on owned NFTs
    for (let tokenId of tokenIds) {

          try {
            const response = await fetch(`https://gateway.pinata.cloud/ipfs/QmQ2jnDYecFhrf3asEWjyjZRX1pZSsNWG3qHzmNDvXa9qg/${tokenId}.json`);
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            const jsonData = await response.json();
            // items.push(jsonData);
            items[tokenId] = jsonData
          } catch (error) {
            console.error('There was a problem fetching data:', error);
          }

    }
    setNFTMetadata(items);

    // // Fetch pauze indicator
    let _isPauzed = await nft.isPauzed();
    setIsPauzed(_isPauzed)


    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />

      <h1 className='my-4 text-center'>Dapp Punks</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Row>
            <Col>
              {balance > 0 ? (
                <div className='text-center'>
                  <img 
                    src={`https://gateway.pinata.cloud/ipfs/QmQPEMsfd1tJnqYPbnTQCjoa8vczfsV1FmqZWgRdNQ7z3g/${lastNFT}.png`} 
                    alt="Open Punk"
                    height="400px"
                    width="400px"
                  />
                </div>
              ) : (
                <img src={preview} alt="" />
              )}
            </Col>
            <Col>
              <div className='my-4 text-center'>
                <Countdown date={parseInt(revealTime)} className='h2'/>
              </div>
              <Data 
                maxSupply={maxSupply} 
                totalSupply={totalSupply}
                cost={cost}
                balance={balance}
              />
              <Mint
                provider={provider}
                nft={nft}
                cost={cost}
                setIsLoading={setIsLoading}
                isPauzed={isPauzed} 
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <div className='my-4 text-center'>
                <h3 className='my-4 text-center'>Owned NFT's</h3>
              </div>
            </Col>
          </Row>

          <Row>
            <NFTMetadata
              _NFTMetadata={_NFTMetadata}
            />
          </Row>
        </>
      )}
    </Container>

  )
}

export default App;