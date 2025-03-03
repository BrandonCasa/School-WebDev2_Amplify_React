import { IUser } from "./user.types";

export enum UserInteractionType {
	FriendRequest,
	Message,
}

export interface IUserInteraction {
	sender: IUser | string;
	recipient: IUser | string;
	created: Date;
	lastModified: Date;
	interactionType: UserInteractionType;
}

export interface IFriendRequest extends IUserInteraction {
	interactionType: UserInteractionType.FriendRequest;
	senderStatus: boolean;
	recipientStatus: boolean;
	status: boolean;
}

export interface IMessage extends IUserInteraction {
	interactionType: UserInteractionType.Message;
	//editDiffHistory: IMessageEditDiff[] | null;
	//content: IMessage;
	//channel: IChannel;
}
