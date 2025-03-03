export interface IUser {
	userID: string;
	displayName: string | "Unknown";
	rank: string | "Unranked";
	status: string | "Offline";
	profilePictureBlob: string | null;
	biography: string | "";
}

export interface IMyUser extends IUser {
	email: string | null;
	//friends: IFriend[];
}

//export class User implements IUser {}
