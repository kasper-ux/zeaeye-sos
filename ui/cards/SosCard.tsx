import React, { useState } from 'react';
import styled from 'styled-components';
import { BaseCard } from './BaseCard';
import { CardContent, Error, Header, InfoCard, Input, InputLabel, InputWrapper, LinkButton, Loading, Note, PrimaryButton, StateButton, Subtitle, Symbol, Title } from '@ui/styles';
import { Skeleton } from '@ui/loading/Skeleton';
import { Alarm, SosReply, SosReplyData, User } from '@utils/entities';
import { toast } from 'react-hot-toast';

interface SosCardProps {
	user?: User
	alarm?: Alarm,
	onCancel: () => Promise<void>,
	error?: string,
	reply?: SosReplyData,
}

export const SosCard = ({ user, alarm, onCancel, error, reply }: SosCardProps) => {
	const [loading, setLoading] = useState<boolean>(false);

	const handleSosDismiss = async () => {
		if (onCancel) {
			await onCancel().then(() => {
				toast.success("")
			}).finally(() => {
				setLoading(false);
			})
		}
	}

	return (
		<BaseCard>
			<CardContent
				isLoading={loading}>
				<Header>
					<Title>
						⚠️
					</Title>
					<Title>
						S.O.S Alarm Aktiveret
					</Title>
				</Header>
				<InfoCard>
					{user ? user.name : error ?
						<Error>
							{error}
						</Error>
						:
						<Skeleton width={19.5}>
							Henter kontakt...
						</Skeleton>
					}
				</InfoCard>
				{reply?.state == "disapproved" ?
					<StateButton
						disabled
						color="#fd0909"
						title="Falsk alarm">
						Du har meldt alarmen falsk
					</StateButton>
					:
					<PrimaryButton
						disabled={(alarm == null || user == null)}
						color="#fd0909"
						onClick={handleSosDismiss}
						title="Afbryd alarmen">
						Afbryd (Falsk Alarm)
					</PrimaryButton>
				}
				<Note>
					Afbryd kun alarmen hvis du er helt sikker på at den er falsk!
				</Note>
			</CardContent>
		</BaseCard>
	);
}
