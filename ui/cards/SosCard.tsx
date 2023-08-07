import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BaseCard } from './BaseCard';
import { CardContent, Error, Header, InfoCard, Input, InputLabel, InputWrapper, LinkButton, Loading, Note, PrimaryButton, StateButton, Subtitle, Symbol, Title } from '@ui/styles';
import { Skeleton } from '@ui/loading/Skeleton';
import { Alarm, SosReply, SosReplyData, User } from '@utils/entities';
import { toast } from 'react-hot-toast';
import { DescriptionInput } from '@ui/inputs/DescriptionInput';

interface SosCardProps {
	user?: User
	alarm?: Alarm,
	initialComment?: string,
	onCancel: () => Promise<void>,
	onComment: (comment: string) => Promise<void>,
	error?: string,
	reply?: SosReplyData,
}

export const SosCard = ({ user, alarm, initialComment, onCancel, onComment, error, reply }: SosCardProps) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [comment, setComment] = useState<string>("");

	useEffect(() => {
		if (initialComment) {
			setComment(initialComment)
		}
	}, [initialComment])

	const handleSosDismiss = async () => {
		setLoading(true);
		await onCancel().then(() => {
			toast.success("Du har meldt alarmen falsk!")
		}).finally(() => {
			setLoading(false);
		})
	}

	const handleAddComment = async () => {
		setLoading(true);
		await onComment(comment).then(() => {
			toast.success("Din kommentar blev tilføjet!")
			setComment("");
		}).finally(() => {
			setLoading(false);
		})
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
				{reply?.state == "disapproved" &&
					<DescriptionInput
						initialValue={initialComment}
						onChange={setComment}
						placeholder='Angiv begrundelse for afmeldelsen...' />
				}
				{reply?.state == "disapproved" ?
					comment.length > 0 ?
						<PrimaryButton
							color="#0073f6"
							onClick={handleAddComment}
							title="Tilføj kommentar">
							Tilføj kommentar
						</PrimaryButton>
						:
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
