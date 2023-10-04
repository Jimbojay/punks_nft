import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const Mint = ({ provider, nft, cost, setIsLoading, isPauzed }) => {
	const [isWaiting, setIsWaiting] = useState(false);
	const [numNFTs, setNumNFTs] = useState(1); // Initialize the input value with 1


	const mintHandler = async (e) => {
		e.preventDefault()
		setIsWaiting(true)

		try {
			const signer = await provider.getSigner()
			const transaction_cost = (cost * numNFTs).toString()
			const transaction = await nft.connect(signer).mint(numNFTs.toString(), { value: transaction_cost })
			await transaction.wait()
		} catch {
			window.alert('User rejected or transaction reverted')
		}

		setIsLoading(true)

	}

	const handleInputChange = async (e) => {
		setNumNFTs(parseInt(e.target.value)); // Update numNFTs state when input changes
	};


	return(
		<Form onSubmit={mintHandler} style={{ maxWidth: '450px', margin:'50px auto' }}>
			{isWaiting ? (
				<Spinner animation="border" style={{ display: 'block', margin: '0 auto' }}/>
//			) : isPauzed ? (
//			    <div style={{ textAlign: 'center' }}>
//			      <p>Unfortunately, minting is currently paused. Please try again soon.</p>
//			    </div>
			) : (
				<Form.Group>
					<Form.Label>#NFTs to mint</Form.Label>
					<Form.Control 
						type="number" 
						placeholder="Enter the number of NFTs to mint" 
						value={numNFTs}
						onChange={handleInputChange}
					/>
					<Button variant="primary" type="submit" style={{ width:'100%' }}>
						Mint
					</Button>
				</Form.Group>
			)}
		</Form>
	)

}

export default Mint
