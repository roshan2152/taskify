import { UniqueIdentifier } from "@dnd-kit/core";

export type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: {
        id: UniqueIdentifier;
        title: string
    }[]
};

export type itemType = {
    id: UniqueIdentifier;
    title: string
};


export type BoardType = {
    id: string;
    boardName: string,
    containers: DNDType[],
};

export type ProjectId = string;


export type ProjectType = {
    id: string,
    projectName: string,
    members: string[],
    boards: string[],
    userId: string
}

export type TicketType = {
    id: string,
    ticketName: string,
    description: string,
    comments: string,
    assignee: string,
    reporter: string,
    createdAt: Date,
};


export type UserType = {
    uid: string,
    email: string,
    name: string,
};

export type MemberType = {
    name: string;
    email: string;
    role: string;
}

// email recovery code
// VHAYTXZ5BLWYFEF43ATW5Z4Q