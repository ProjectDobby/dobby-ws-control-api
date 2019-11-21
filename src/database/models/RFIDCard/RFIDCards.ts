import monogoose, {Schema} from "mongoose";
import {RFIDCardsModel} from "./RFIDCardsModel";

export const RFIDCardsSchema = new Schema<RFIDCardsModel>({
    token: {type: String, required: true}
});
