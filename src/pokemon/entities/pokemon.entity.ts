import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Pokemon extends Document{
  // id: string  <--- mongo ya proporciona los ids
  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    unique: true,
    index: true,
  })
  identifier: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
