import * as mongoose from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

class CurationGame {
  @prop()
  title?: string;
  @prop()
  alternateTitles?: string;
  @prop()
  series?: string;
  @prop()
  developer?: string;
  @prop()
  publisher?: string;
  @prop()
  status?: string;
  @prop()
  extreme?: boolean;
  @prop({ type: () => [String] })
  tags?: string[];
  @prop()
  source?: string;
  @prop()
  launchCommand?: string;
  @prop()
  library?: string;
  @prop()
  notes?: string;
  @prop()
  curationNotes?: string;
  @prop()
  platform?: string;
  @prop()
  applicationPath?: string;
  @prop()
  playMode?: string;
  @prop()
  releaseDate?: string;
  @prop()
  version?: string;
  @prop()
  originalDescription?: string;
  @prop()
  language?: string;
}

class CurationAddApp {
  @prop()
  heading?: string;
  @prop()
  applicationPath?: string;
  @prop()
  launchCommand?: string;
}

class Curation {
  @prop()
  game: CurationGame;
  @prop({ type: () => CurationAddApp })
  addApps: CurationAddApp[];
}

export const CurationModel = getModelForClass(Curation);
