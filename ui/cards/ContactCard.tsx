import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BaseCard } from './BaseCard';
import { EmergencyContact, User, useFirestore } from '@utils/providers/FirestoreProvider';
import { Skeleton } from '@ui/loading/Skeleton';
import FirestoreSource from '@config/firestore';

interface ContactCardProps {
	contact?: EmergencyContact;
	onUpdate?: (address?: string, age?: number) => Promise<void>;
}

export const ContactCard = ({ contact, onUpdate }: ContactCardProps) => {
	const [address, setAddress] = useState<string>();
	const [age, setAge] = useState<number>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (contact?.address) setAddress(contact.address)
		if (contact?.age) setAge(contact.age)
	}, [contact])

	const handleAddressChange = (e: any) => {
		setAddress(e.target.value);
	}

	const handleAgeChange = (e: any) => {
		setAge(e.target.value);
	}

	const handleDeny = async () => {
		//setLoading(true);
	}

	const handleAccept = async () => {
		setLoading(true);
		if (onUpdate) {
			await onUpdate(address, age).then(() => {
				// todo: show success message
			}).catch((e: any) => {
				console.error(e);
				// todo: show error message
			}).finally(() => {
				setLoading(false);
			});
		}
	}

	const getContactRelation = (relation: string) => {
		switch (relation) {
			case "partner":
				return 'Partner';
			case "child":
				return 'Barn';
			case "parent":
				return 'Forælder';
			case "parentInLaw":
				return 'Svigerforælder';
			case "grandParent":
				return 'Bedsteforælder';
			case "friend":
				return 'Ven';
			case "acquaintance":
				return 'Bekendt';
			case "other":
				return 'Anden';
			default:
				return relation;
		}

	}

	if (!contact)
		return <ContactCardSkeleton />

	return (
		<BaseCard>
			<Content
				isLoading={loading}>
				<ContactName>
					{contact?.contactName}
				</ContactName>
				<ContactRelation>
					{getContactRelation(contact?.relationType)}
				</ContactRelation>
				<ContactDetails>
					<ContactPhone
						value={contact?.contactPhone}
						disabled />
					<Spacer />
					<ContactAddress
						placeholder="Tilføj adresse (valgfri)"
						onChange={handleAddressChange}
						value={address} />
					<Spacer />
					<ContactAge
						type="number"
						placeholder="Alder (valgfri)"
						onChange={handleAgeChange}
						value={age} />
				</ContactDetails>
				<Actions>
					{loading ?
						<Skeleton
							width={20}
							height={2.5}>
							<Loading>Gemmer oplysninger...</Loading>
						</Skeleton>
						:
						<ActionAccept
							onClick={handleAccept}
							title="Bekræft">
							Bekræft nødkontakt
						</ActionAccept>
					}
					<Spacer />
					<ActionDeny
						onClick={handleDeny}
						title="Afvis">
						Afvis nødkontakt
					</ActionDeny>
				</Actions>
			</Content>
		</BaseCard>
	);
}

const Content = styled.div<{ isLoading?: boolean }>`
	display: flex;
	flex-direction: column;
	align-items: center;
	position: relative;
	justify-content: center;
	width: 100%;
	opacity: ${props => props.isLoading ? "0.5" : "1.0"};
	pointer-events: ${props => props.isLoading ? "none" : "all"};
`

const ContactDetails = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	margin-top: 1rem;
	position: relative;
`

const Input = styled.input`
	padding: 0.8rem 1rem;
	border: 0;
	font-size: 0.8rem;
	border-radius: 0.25rem;
	background: #ffffff;
	border: 1px solid #e7e7e7;
	&:disabled {
		background: #e7e7e7;
		box-shadow: none;
	}
`

const ContactName = styled.div`
	font-size: 1.4rem;
	font-weight: 800;
	margin: 0.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
`

const ContactPhone = styled(Input)`
	
`

const ContactAge = styled(Input)`

`

const ContactAddress = styled(Input)`

`

const ContactRelation = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-size: 0.9rem;
`

const Actions = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 1rem;
	position: sticky;
	bottom: 0;
`

const Action = styled.button`
	display: flex;
	align-items: center;
	text-align: center;
	justify-content: center;
	padding: 0rem 1rem;
	height: 2.5rem;
	border: 0;
	color: #ffffff;
	border-radius: 0.25rem;
	cursor: pointer;
	font-weight: 500;
`

const ActionDeny = styled(Action)`
	background: #ffffff;
	color: #8c8c8c;
	text-decoration: underline;
	width: 8rem;
	&:hover {
		color: #ff0000;
	}
`

const ActionAccept = styled(Action)`
	background: #009d37;
	transition: all 0.3s ease;
	width: 100%;
	&:hover {
		filter: brightness(1.1);
	}
	&:active {
		transform: scale(0.98);
		filter: brightness(0.95);
	}
`

const Note = styled.span`
	color: #8a8a8a;
	margin-top: 1rem;
	font-size: 0.9rem;
	text-align: center;
`
const Spacer = styled.div<{ height?: number }>`
	display: flex;
	height: ${props => props.height ?? "0.5"}rem;
`

const Loading = styled.span`
	font-size: 0.8rem;
	font-weight: 500;
`

const ContactCardSkeleton = () => (
	<BaseCard>
		<Content>
			<ContactName>
				<Skeleton width={12} height={1.9} />
			</ContactName>
			<Spacer height={0.5} />
			<ContactRelation>
				<Skeleton width={6} height={1} />
			</ContactRelation>
			<Spacer height={1} />
			<Skeleton width={20} height={2.5} />
			<Spacer />
			<Skeleton width={20} height={2.5} />
			<Spacer />
			<Skeleton width={20} height={2.5} />
			<Actions>
				<Skeleton width={20} height={2.5} />
			</Actions>
			<Spacer height={1.25} />
			<Skeleton width={6} height={1.2} />
			<Spacer height={0.5} />
		</Content>
	</BaseCard>
);