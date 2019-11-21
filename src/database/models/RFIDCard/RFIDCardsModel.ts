import {Document} from "mongoose";

export interface RFIDCardsModel extends Document{
    cardstring: string;
}
