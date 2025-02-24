export interface User {
	userID: string;
	displayName: string | "Unknown";
	rank: string | "Unranked";
	status: string | "Offline";
	profilePictureBlob: string | null;
	biography: string | "";
}

export enum UserInteractionType {
	Block,
	FriendRequest,
	GroupInvite,
	Message,
}

export interface FriendRequestInfo {
	accepted: boolean;
}
export interface GroupInviteInfo {}
export interface MessageInfo {
	content: [];
	channelID: string;
}

export function modifyInteraction(modifierUser: User, interaction: UserInteraction, callback: () => void) {
	switch (interaction.interactionType) {
		case UserInteractionType.Block:
			// unblock user
			break;
		case UserInteractionType.FriendRequest:
			if (interaction?.specialInfo?.accepted) {
				// remove friend
			} else if (interaction?.receiver == modifierUser) {
				// accept friend request
			} else if (interaction?.sender == modifierUser) {
				// cancel friend request
			}
			break;
		default:
			break;
	}
	callback();
}

export interface UserInteraction {
	sender: User;
	receiver: User;
	created: Date;
	lastModified: Date;
	interactionType: UserInteractionType;
	specialInfo: FriendRequestInfo | GroupInviteInfo | MessageInfo | null;
}

export interface MyUser extends User {
	email: string;
	friends: UserInteraction[];
}
