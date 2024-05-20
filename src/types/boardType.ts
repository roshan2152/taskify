import { UniqueIdentifier } from "@dnd-kit/core";

type DNDType = {
    id: UniqueIdentifier;
    title: string;
    items: {
        id: UniqueIdentifier;
        title: string
    }[]
}


export type BoardType = {
    id: string;
    boardName: string,
    containers: DNDType[],
};