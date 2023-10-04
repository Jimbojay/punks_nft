import Table from 'react-bootstrap/Table';

const NFTMetadata = ({ _NFTMetadata }) => {


	return (
		<Table striped bordered hover responsive>
			<thead>
				<tr>
					<th colSpan="2"></th>
					<th colSpan="6">Attributes</th>
				</tr>
				<tr>
					<th>Name</th>
					<th>Edition</th>
					<th>Backgrounds</th>
					<th>Face</th>
					<th>Hats and hairs</th>
					<th>Eyes and glasses</th>
					<th>Nose</th>
					<th>Mouth</th>
				</tr>
			</thead>
			<tbody>
				{_NFTMetadata.map((nft, index) => (
					<tr key={index}>
						<td>{nft.name}</td>
						<td>{nft.edition}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Backgrounds")?.value}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Face")?.value}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Hats and Hair")?.value}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Eyes and Glasses")?.value}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Nose")?.value}</td>
						<td>{nft.attributes.find(attribute => attribute.trait_type === "Mouth")?.value}</td>

					</tr>
				))}
			</tbody>
		</Table>
	);

}

export default NFTMetadata;