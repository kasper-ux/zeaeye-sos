import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseCard } from './BaseCard';
import { EmergencyContact, User } from '@utils/providers/FirestoreProvider';
import { Skeleton } from '@ui/loading/Skeleton';

interface ContactCardProps {
	contact?: EmergencyContact;
}

export const ContactCard = ({ contact }: ContactCardProps) => {
	const [address, setAddress] = useState<string>("");
	const [age, setAge] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);

	const handleAddressChange = (e: any) => {
		setAddress(e.target.value);
	}

	const handleAgeChange = (e: any) => {
		setAge(e.target.value);
	}

	const handleDeny = async () => {
		setLoading(true);
	}

	const handleAccept = async () => {
		setLoading(true);
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

	if (!contact) {
		return (
			<ContactCardSkeleton />
		)
	}

	return (
		<BaseCard>
			<Content isLoading={loading}>
				<ContactName>
					{contact?.contactName}
				</ContactName>
				<ContactRelation>
					{getContactRelation(contact?.contactRelation)}
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
				{loading ?
					<Actions>
						<Skeleton
							width={20}
							height={2.5}>
							<Loading>Gemmer oplysninger...</Loading>
						</Skeleton>
					</Actions>
					:
					<Actions>
						<ActionDeny
							onClick={handleDeny}
							title="Afvis">
							Afvis
						</ActionDeny>
						<ActionAccept
							onClick={handleAccept}
							title="Bekræft">
							Bekræft nødkontakt
						</ActionAccept>
					</Actions>
				}
			</Content>
			<Note>Nødkontakten bliver tilføjet til din profil.</Note>
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
	font-size: 1rem;
	border-radius: 0.25rem;
	background: #ffffff;
	border: 1px solid #e7e7e7;
	&:disabled {
		background: #e7e7e7;
		box-shadow: none;
	}
`

const ContactName = styled.div`
	font-size: 1.8rem;
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
`

const Actions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	width: 100%;
	margin-top: 1rem;
	position: sticky;
	bottom: 0;
	& > *:not(:last-child) {
		margin-right: 1rem;
	}
`

const Action = styled.button`
	display: flex;
	flex: 1;
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
	border: 1px solid #8c8c8c;
	max-width: 6rem;
`

const ActionAccept = styled(Action)`
	background: #009d37;
`

const Note = styled.span`
	color: #8a8a8a;
	margin-top: 1rem;
	font-size: 0.9rem;
	text-align: center;
`
const Spacer = styled.div`
	display: flex;
	height: 0.5rem;
`

const Loading = styled.span`
	font-size: 0.8rem;
	font-weight: 500;
`

const ContactCardSkeleton = () => (
	<BaseCard>
		<ContactName>
			<Skeleton width={12} height={2.2} />
		</ContactName>
		<ContactRelation>
			<Skeleton width={8} height={1.4} />
		</ContactRelation>
		<Spacer />
		<Spacer />
		<Skeleton width={20} height={2.5} />
		<Spacer />
		<Skeleton width={20} height={2.5} />
		<Spacer />
		<Skeleton width={20} height={2.5} />
		<Actions>
			<Skeleton width={8} height={2.5} />
			<Skeleton width={20} height={2.5} />
		</Actions>
		<Spacer />
		<Spacer />
		<Skeleton width={20} height={1.2} />
	</BaseCard>
);