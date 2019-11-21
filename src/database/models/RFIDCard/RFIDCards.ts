import monogoose, {Schema} from "mongoose";
import {RFIDCardsModel} from "./RFIDCardsModel";

export const RFIDCardsSchema = new Schema<RFIDCardsModel>({
    cardstring: {type: String, required: true}
});

export const RFIDCardsDbModel = monogoose.model<RFIDCardsModel>('RFIDCards', RFIDCardsSchema);
