import React, { useEffect, useRef, useState } from 'react';
import { BaseCard } from './BaseCard';
import { Skeleton } from '@ui/loading/Skeleton';
import { toast } from 'react-hot-toast';
import { CardContent, Header, Input, InputLabel, InputWrapper, LinkButton, Loading, PrimaryButton, Spacer, StateButton, Subtitle, Symbol, Title } from '@ui/styles';
import { EmergencyContact } from '@utils/entities';
import { EmergencyContactConfirmationData } from '@utils/entities/EmergencyContactConfirmation';

interface ContactCardProps {
	contact?: EmergencyContact | null;
	confirmation?: EmergencyContactConfirmationData;
	onAccept?: (address?: string, age?: number) => Promise<void>;
	onDeny?: () => Promise<void>;
}

enum ContactState {
	accepted,
	denied,
	pending
}

export const ContactCard = ({ contact, confirmation, onAccept, onDeny }: ContactCardProps) => {
	const [address, setAddress] = useState<string>("");
	const [age, setAge] = useState<string>("");
	const [loading, setLoading] = useState<boolean>(false);
	const addressRef = useRef(null);
	const ageRef = useRef(null);
	const [contactState, setContactState] = useState<ContactState>(ContactState.pending);

	useEffect(() => {
		if (contact?.address) setAddress(contact.address)
		if (contact?.age) setAge(contact.age.toString())
	}, [contact])

	useEffect(() => {
		if (!loading) {
			setTimeout(() => {
				//@ts-ignore
				addressRef.current?.focus();
			}, 500);
		}
	}, [loading])

	useEffect(() => {
		setContactState(ContactState.pending);
	}, [address, age])

	const handleAddressChange = (e: any) => {
		setAddress(e.target.value);
	}

	const handleAgeChange = (e: any) => {
		setAge(e.target.value);
	}

	const handleDeny = async () => {
		setLoading(true);
		if (onDeny) {
			await onDeny().then(() => {
				setContactState(ContactState.denied);
				toast.success("Nødkontakt afvist");
			}).catch((e: any) => {
				console.error(e);
				toast.error("Der skete en fejl... Prøv igen.");
			}).finally(() => {
				setLoading(false);
			});
		}
	}

	const handleAccept = async () => {
		setLoading(true);
		if (onAccept) {
			await onAccept(address, parseInt(age)).then(() => {
				setContactState(ContactState.accepted);
				toast.success("Nødkontakt gemt!");
			}).catch((e: any) => {
				console.error(e);
				toast.error("Der skete en fejl... Prøv igen.");
			}).finally(() => {
				setLoading(false);
			});
		}
	}

	const handleKeyUp = (e: any) => {
		console.log(e)
		//if (e.key)
	}

	const getContactRelation = (relation?: string) => {
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
				return relation ?? "-";
		}

	}

	if (!contact)
		return <ContactCardSkeleton />

	return (
		<BaseCard>
			<CardContent
				isLoading={loading}>
				<Header>
					<Title>
						{contact?.contactName ?? "Ukendt"}
					</Title>
					<Subtitle>
						{getContactRelation(contact?.relationType)}
					</Subtitle>
				</Header>
				<Input
					value={contact?.contactPhone}
					disabled />
				<Input
					onKeyUp={handleKeyUp}
					ref={addressRef}
					tabIndex={1}
					autoFocus
					autoComplete="street-address"
					placeholder="Tilføj adresse (valgfri)"
					onChange={handleAddressChange}
					value={address} />
				<InputWrapper>
					<InputLabel>
						Alder
					</InputLabel>
					<Input
						ref={ageRef}
						tabIndex={2}
						min={12}
						max={99}
						type="number"
						placeholder="(valgfri)"
						onChange={handleAgeChange}
						value={age} />
				</InputWrapper>
				{loading ?
					<Skeleton
						width={20}
						height={2.5}>
						<Loading>Gemmer oplysninger...</Loading>
					</Skeleton>
					:
					contactState == ContactState.accepted ?
						<StateButton
							title="Gemt">
							Nødkontakt gemt
							<Symbol color="#009d37">
								✔
							</Symbol>
						</StateButton>
						: contactState == ContactState.denied ?
							<StateButton
								title="Gemt">
								Nødkontakt afvist
								<Symbol color="#ff0000">
									✖
								</Symbol>
							</StateButton>
							:
							<PrimaryButton
								color="#009d37"
								onClick={handleAccept}
								title="Bekræft">
								Bekræft nødkontakt
							</PrimaryButton>
				}
				<LinkButton
					onClick={handleDeny}
					title="Afvis">
					Afvis nødkontakt
				</LinkButton>
			</CardContent>
		</BaseCard>
	);
}

const ContactCardSkeleton = () => (
	<BaseCard>
		<CardContent>
			<Header>
				<Title>
					<Skeleton width={12} height={1.8} />
				</Title>
				<Spacer height={0.5} />
				<Subtitle>
					<Skeleton width={6} height={1} />
				</Subtitle>
			</Header>
			<Skeleton width={20} height={2.5} />
			<Skeleton width={20} height={2.5} />
			<Skeleton width={20} height={2.5} />
			<Skeleton width={20} height={3} />
			<Spacer height={0.5} />
			<Skeleton width={6} height={1.2} />
			<Spacer height={0.5} />
		</CardContent>
	</BaseCard>
);