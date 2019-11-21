import {Document} from "mongoose";

export interface RFIDCardsModel extends Document{
    cardtoken: string;
}
